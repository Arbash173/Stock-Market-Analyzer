from django.urls import path
from . import views
from . import api_views

urlpatterns = [
    path('', views.login_signup, name='login_signup'),

    path('profile_update', views.profile_update, name='profile_update'),

    path('profile', views.profile, name='profile'),
    
    path('register_user', views.register_user, name='register_user'),

    path('register', views.register, name='register'),

    path('login', views.login, name='login'),
    
    path('aboutus', views.aboutus, name='aboutus'),
    
    path('market_summary', views.market_summary, name='market_summary'),
    
    path('market_charts', views.market_charts, name='market_charts'),

    path('bullet_charts', views.bullet_charts, name='bullet_charts'),

    path('pie_charts', views.pie_charts, name='pie_charts'),
    
    path('top_comp', views.top_comp, name='top_comp'),

    path('candelistic', views.candelistic, name='candelistic'),
    
    path('index', views.index, name='index'),
    
    path('logout', views.logoutUser, name='logout'),
    
    path('stock_name', views.stock_name, name='stock_name'),
    
    path('stock_search', views.stock_search, name='stock_search'),

    path('historic_fm', views.historic_fm, name='historic_fm'),

    path('historic_data', views.historic_data, name='historic_data'),

    path('predictions', views.prediction, name='predictions'),
    
    path('data_download', views.data_download, name='data_download'),

    path('verify/<auth_token>', views.verify, name='verify'),

    path('change_password/<auth_token>', views.change_password, name='change_password'),

    path('error', views.error_page, name='error'),

    path('forgot_password', views.forgot_password, name='forgot_password'),

    path('update_password', views.update_password, name='update_password'),

    path('update', views.update, name='update'),

    # API Endpoints
    path('api/market-summary', api_views.api_market_summary, name='api_market_summary'),
    path('api/top-companies', api_views.api_top_companies, name='api_top_companies'),
    path('api/historic-data', api_views.api_historic_data, name='api_historic_data'),
    path('api/stock-search', api_views.api_stock_search, name='api_stock_search'),
    path('api/prediction', api_views.api_prediction, name='api_prediction'),
    path('api/login', api_views.api_login, name='api_login'),
    path('api/logout', api_views.api_logout, name='api_logout'),
    path('api/register', api_views.api_register, name='api_register'),
]
