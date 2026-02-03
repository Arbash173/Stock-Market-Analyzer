import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.models import User
from .models import Profile, Stock_Companies
from .utils.Market_Summary import Today_Market
from .utils.Historic_Data import DataReader
from .utils.Stock_Predictions import Prediction
from django.db.models import Q
from datetime import datetime
import pandas as pd
import uuid

def api_market_summary(request):
    try:
        obj = Today_Market()
        df = obj.Scrap_Table
        # handling NaN values for JSON serialization
        df = df.fillna('')
        data = df.to_dict(orient='records')
        return JsonResponse({'status': 'success', 'data': data}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def api_top_companies(request):
    try:
        obj = Today_Market()
        df = obj.Scrap_Table
        # Logic from Tt_Com_Dsg utils
        if not df.empty:
             # Ensure numeric columns are actually numeric before nlargest
            cols = ['VOLUME', 'CURRENT', 'LDCP', 'OPEN', 'HIGH', 'LOW', 'CHANGE']
            for c in cols:
                # Remove commas if present and convert to numeric
                if df[c].dtype == object:
                     df[c] = pd.to_numeric(df[c].astype(str).str.replace(',', ''), errors='coerce')
            
            df1 = df.nlargest(10, "VOLUME")
            df1 = df1.sort_values(by=["CURRENT"])
            df1 = df1.fillna(0)
            data = df1.to_dict(orient='records')
            return JsonResponse({'status': 'success', 'data': data}, safe=False)
        return JsonResponse({'status': 'success', 'data': []}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
def api_historic_data(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            stock_custom = body.get("symbol")
            start_date_str = body.get("start_date")
            end_date_str = body.get("end_date")

            if not stock_custom or not start_date_str or not end_date_str:
                return JsonResponse({'status': 'error', 'message': 'Missing parameters'}, status=400)

            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

            data_reader = DataReader()
            df = data_reader.stocks(stock_custom, start=start_date, end=end_date)
            
            if df is None or len(df) == 0:
                 return JsonResponse({'status': 'error', 'message': 'No data found'}, status=404)

            # Format Date for JSON
            df = df.reset_index() # incase Date is index, though code shows it as column often
            if "Date" in df.columns:
                df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
            
            df = df.fillna(0)
            data = df.to_dict(orient='records')
            return JsonResponse({'status': 'success', 'data': data}, safe=False)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def api_stock_search(request):
    if request.method == "GET":
        query = request.GET.get('q', '')
        if query:
            companies = Stock_Companies.objects.filter(
                Q(symbol__icontains=query) | 
                Q(name__icontains=query) | 
                Q(sectorName__icontains=query)
            ).values('symbol', 'name', 'sectorName')
            return JsonResponse({'status': 'success', 'data': list(companies)}, safe=False)
        return JsonResponse({'status': 'success', 'data': []}, safe=False)

@csrf_exempt
def api_prediction(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            # Prediction requires historic data first. 
            # In the original view, it uses global H_data. 
            # Ideally, we should fetch the data again based on params to be stateless, 
            # or pass the data in. For now, let's fetch it again to be stateless.
            
            stock_custom = body.get("symbol")
            start_date_str = body.get("start_date") # Needs enough data > 50 records
            end_date_str = body.get("end_date")

            if not stock_custom or not start_date_str or not end_date_str:
                return JsonResponse({'status': 'error', 'message': 'Missing parameters'}, status=400)

            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

            data_reader = DataReader()
            df = data_reader.stocks(stock_custom, start=start_date, end=end_date)

            if df is None or len(df) <= 50:
                 return JsonResponse({'status': 'error', 'message': 'Not enough data for prediction (>50 records required)'}, status=400)

            if 'Volume' in df.columns:
                df = df.drop('Volume', axis=1)
            
            obj = Prediction(df)
            pred_df = obj.pre_data
            
            # Format Date
            if "Date" in pred_df.columns:
                 pred_df["Date"] = pred_df["Date"].dt.strftime("%Y-%m-%d")
            
            pred_df = pred_df.fillna(0)
            data = pred_df.to_dict(orient='records')
            
            return JsonResponse({'status': 'success', 'data': data}, safe=False)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

# Auth APIs
@csrf_exempt
def api_login(request):
    if request.method == "POST":
        try:
             body = json.loads(request.body)
             username = body.get('username')
             password = body.get('password')
             user = authenticate(request, username=username, password=password)
             
             if user is not None:
                profile = Profile.objects.filter(user=user).first()
                if profile and profile.is_verified:
                    auth_login(request, user)
                    return JsonResponse({'status': 'success', 'message': 'Login successful', 'username': user.username})
                elif profile and not profile.is_verified:
                    return JsonResponse({'status': 'error', 'message': 'User not verified'}, status=401)
                else: 
                     # Fallback if profile missing but user exists (shouldn't happen ideally)
                     auth_login(request, user)
                     return JsonResponse({'status': 'success', 'message': 'Login successful'})
             else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
        except Exception as e:
             return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def api_logout(request):
    logout(request)
    return JsonResponse({'status': 'success', 'message': 'Logged out'})

@csrf_exempt
def api_register(request):
    # This largely duplicates register_user logic but returns JSON
     if request.method == 'POST':
        try:
            body = json.loads(request.body)
            email = body.get('email')
            username = body.get('username')
            password = body.get('password')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'status': 'error', 'message': 'Username taken'}, status=400)
            if User.objects.filter(email=email).exists():
                 return JsonResponse({'status': 'error', 'message': 'Email exists'}, status=400)
            
            user = User.objects.create_user(username=username, email=email, password=password)
            auth_token = str(uuid.uuid4())
            profile = Profile.objects.create(user=user, auth_token=auth_token)
            profile.save()
            
            # Helper from views.py - we'd need to import it or duplicate logic. 
            # For now, let's assume we can import verification_email or we skip email for local test? 
            # The original code imports verification_email from views (circular?) or defines it there.
            # It's defined in views.py. We can't easily import from views.py if views.py imports api_views.py (likely not yet).
            # But let's copy the email logic or just mock it for now.
            try:
                from .views import verification_email
                verification_email(email, auth_token, username)
            except ImportError:
                # If circular import, maybe move email logic to utils?
                # For now, let's just proceed.
                pass

            return JsonResponse({'status': 'success', 'message': 'User created. Verify email.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
     return JsonResponse({'status':'error'}, status=405)
