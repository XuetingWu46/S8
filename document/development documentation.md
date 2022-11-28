The framework I adopted for this challenge is React Native. And I applied other third-party services such as Firebase, Alpha Vantage and Algolia. Check out the main feature demo video in [folder](https://github.com/XuetingWu46/S8/blob/main/User%20Manual.md). Part of screenshots will be shown next.<br>
<img src="https://github.com/XuetingWu46/S8/blob/main/document/screenshot1.png" width="200" height="355,56"> 
<img src="https://github.com/XuetingWu46/S8/blob/main/document/screenshot2.png" width="200" height="355,56"> <img src="https://github.com/XuetingWu46/S8/blob/main/document/screenshot3.png" width="200" height="355,56">
<img src="https://github.com/XuetingWu46/S8/blob/main/document/screenshot4.png" width="200" height="355,56"> 
<img src="https://github.com/XuetingWu46/S8/blob/main/document/screenshot5.png" width="200" height="355,56">  


## Code Design & Structure
There are 4 directories in the _src_ directory of project.   <br>
1. **assets**: This directory mainly contains some auxiliary objects. For example, the pictures used in the program and the data needed to configure the use of other third-party services.<br> 
2. **constants**： It contains global variables. Any other javascript file can share its data.<br> 
3. **navigation**: This includes the code implementation and logic of navigation and routes of whole project. <br> 
4. **screens**: The implementation of each functional screen.

## Features
1. **Register and login users via Phone Number (Account / Username) and Password (OTP)**
<br>During development, as shown in the _screenshot_, I used the Firebase Authentication feature to try to authenticate the registration. But it was only successfully verified twice on the Android emulator as the record shown in this _screenshot_. After many attempts, this feature still hasn't been completed. Therefore, when the user uses it, the user can enter the follow-up operation of the project by providing any phone number and OTP in the registration and login interface. I also applied RealTime Database in Firebase to manage accounts. <br>
2. **Search for financial instruments by ticker, common name, or other terms**
<br>I applied Algolia in order to implement this feature. As shown in the _screenshot_, I obtained Financial instrument data from the Alpha Vantage API and uploaded it to algolia in csv format.
 
3. **View information on the financial instrument:<br>
Realtime price of the financial instrument.<br>
Historical price data of the financial instrument.<br> News related to the financial instrument, user should be able to click on the source, and be redirected to the source’s origin.**
<br> The Financial instrument data is derived from the Alpha Vantage API. I used TIME_SERIES_WEEKLY, TIME_SERIES_INTRADAY, TIME_SERIES_DAILY_ADJUSTED, and NEWS_SENTIMENT functions.

4. **Follow the financial instrument in the process adding it to their watch list (portfolio)**
<br> I have applied RealTime Database in Firebase to manage financial instruments of each user account. 

5. **Manage their watch list by adding or removing financial instruments**
<br> I have applied RealTime Database in Firebase to manage financial instruments of each user account. 

6. **Have an overview of the losses and gains in their portfolio**
<br> I have applied Alpha Vantage API to get price data and compared changes. 

