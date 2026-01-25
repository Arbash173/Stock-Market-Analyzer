from concurrent.futures import ThreadPoolExecutor, as_completed, _base
from dateutil.relativedelta import relativedelta
from pandas import DataFrame as container
from bs4 import BeautifulSoup as parser
from collections import defaultdict
from datetime import datetime, date

import threading
import pandas as pd
import numpy as np
import requests

import plotly.graph_objects as go


class DataReader:

    def __init__(self):
        self.__history = "https://dps.psx.com.pk/historical"

        self.__local = threading.local()

    @property
    def session(self):
        if not hasattr(self.__local, "session"):
            self.__local.session = requests.Session()
        return self.__local.session

    def get_psx_data(self, symbol, dates, start, end):

        data = futures = []

        with ThreadPoolExecutor(max_workers=6) as executor:
            for date in dates:
                futures.append(executor.submit(
                    self.download, symbol=symbol, date=date))

            for future in as_completed(futures):
                data.append(future.result())

            data = [instance for instance in data if isinstance(
                instance, container)]

        return self.preprocess(data, start, end)

    def stocks(self, tickers, start, end):
        tickers = [tickers]
        dates = self.daterange(start, end)

        data = [self.get_psx_data(ticker, dates, start, end)
                for ticker in tickers]

        if len(data) == 1:
            return data[0]

        return pd.concat(data, keys=tickers, names=["Ticker", "Date"])

    def download(self, symbol, date):
        session = self.session
        post = {"month": date.month, "year": date.year, "symbol": symbol}

        with session.post(self.__history, data=post) as response:
            data = parser(response.text, features="html.parser")
            data = self.toframe(data)
        return data

    def toframe(self, data):
        stocks = defaultdict(list)
        rows = data.select("tr")
        headers = [header.getText() for header in data.select("th")]

        for row in rows:
            cols = [col.getText() for col in row.select("td")]

            for key, value in zip(headers, cols):
                if key == " ":
                    value = datetime.strptime(value, "%b %d, %Y")
                stocks[key].append(value)

        return pd.DataFrame(stocks, columns=headers)

    def daterange(self, start, end):

        # days
        period = end - start
        number_of_months = period.days // 30
        current_date = datetime(start.year, start.month, start.day)

        dates = [current_date]

        for month in range(number_of_months):
            prev_date = dates[-1]
            dates.append(prev_date + relativedelta(months=1))

        dates = dates if len(dates) else [start]

        return dates

    def preprocess(self, data, start, end):

        # concatenate each frame to a single dataframe
        data = pd.concat(data)

        # Rename columns to title case
        data.columns = data.columns.str.strip()  # Remove leading/trailing spaces
        data = data.rename(columns=str.title)

        # Rename Time column to Date
        if "Time" in data.columns:
            data.rename(columns={"Time": "Date"}, inplace=True)
        elif " " in data.columns:  # Handle space column (date column)
            data.rename(columns={" ": "Date"}, inplace=True)

        # Ensure Date column exists
        if "Date" not in data.columns:
            print("Available columns:", data.columns.tolist())
            raise KeyError("Date column not found. Available columns: " + str(data.columns.tolist()))

        # Convert Date column - handle different formats
        # API returns dates like "Feb 26, 2021" which is "%b %d, %Y"
        try:
            # Try parsing with abbreviated month format first (Feb, Jan, etc)
            data["Date"] = pd.to_datetime(data["Date"], format="%b %d, %Y", errors='coerce')
        except Exception as e:
            print(f"First format attempt failed: {e}")
            try:
                # Try full month name format (February, January, etc)
                data["Date"] = pd.to_datetime(data["Date"], format="%B %d, %Y", errors='coerce')
            except Exception as e2:
                print(f"Second format attempt failed: {e2}")
                # Try automatic format detection
                data["Date"] = pd.to_datetime(data["Date"], errors='coerce')
        
        # Check for any NaT (Not a Time) values from failed parsing
        if data["Date"].isna().any():
            print(f"Warning: Some dates could not be parsed. Sample values: {data['Date'].head()}")
        
        # Sort by date
        data = data.sort_values(by="Date")

        # Filter data between two dates
        start_dt = pd.to_datetime(start)
        end_dt = pd.to_datetime(end)
        data = data.loc[(data["Date"] >= start_dt) & (data["Date"] < end_dt)]

        # Remove non-numeric characters from volume column
        if "Volume" in data.columns:
            data["Volume"] = data["Volume"].astype(str).str.replace(",", "")

        # Assigning Type to Columns
        try:
            data = data.astype({'Open': "float", "High": "float",
                               "Low": "float", "Close": "float", "Volume": "int"})
        except Exception as e:
            print(f"Type conversion error: {e}")
            print(f"Columns: {data.columns.tolist()}")
            print(f"Data types:\n{data.dtypes}")

        return data

        # Assigning Type to Columns
        data = data.astype({'Open': "float", "High": "float",
                           "Low": "float", "Close": "float", "Volume": "int"})

        return data

    # table Design
    def Table_Dsg(self, df):

        # Verify required columns exist
        required_cols = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            print(f"Missing columns: {missing_cols}")
            print(f"Available columns: {df.columns.tolist()}")
            raise KeyError(f"Missing required columns: {missing_cols}")

        table = {
            "type": "table",
            "cells": {
                "fill": {"color": ["rgb(128, 255, 170)", "rgb(242, 242, 242)"]},

                "font": {"size": 12, "color": ["rgb(40, 40, 40)"]},

                "height": 27,
                "align": ["center"],
                "format": [None, ", .2f", ", .2f", ",.2f", ",.2f", None],
                "values": [df['Date'], df['Open'], df['High'], df['Low'], df['Close'], df['Volume']],
            },

            "header": {
                "fill": {"color": "rgb(128, 255, 170)"},

                "font": {"size": 14, "color": ["rgb(45, 45, 45)"]},

                "height": 40,
                "align": ["center"],
                "values": ["<b>DATE</b>", "<b>OPEN</b>", "<b>HIGH</b>", "<b>LOW</b>", "<b>CLOSE</b>", "<b>VOLUME</b>"]
            },

            "columnorder": [0, 1, 2, 3, 4, 5],
            "columnwidth": [25, 25, 25, 25, 25, 25],
        }

        data = table

        layout = {
            "width": 1024,
            "height": 800,
            "margin": {"t": 50},
            "plot_bgcolor": "rgba(228, 222, 249, 0.65)"
        }

        fig = go.Figure(data=data, layout=layout)
        config = {"displaylogo": False, }
        return fig, config
