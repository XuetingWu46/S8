import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { navigationRef } from '../navigation/RootNavigation';
import {Register} from "../screens/Register";
import {Login} from "../screens/Login";
import {Main} from "../screens/Main";
import {Search} from "../screens/Search";
import {Portfolio} from "../screens/Portfolio";
import {Details} from "../screens/Details";
import {News} from "../screens/News";
import {Manage} from "../screens/Manage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default class Screens extends React.Component {
    render() {
        return(
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    initialRouteName="Register"
                    // screenOptions={{
                    //     mode: 'card',
                    //     headerShown: 'screen',
                    // }}
                    screenOptions={{
                        headerShadowVisible: false,
                    }}
                >
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{
                            headerShown: false,
                            title: 'Register Page',
                        }}
                    />

                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: false,
                            title: 'Login Page',
                        }}
                    />

                    <Stack.Screen
                        name="News"
                        component={News}
                        options={{
                            headerShown: false,
                            title: 'News Page',
                        }}
                    />

                    <Stack.Screen
                        name="Manage"
                        component={Manage}
                        options={{
                            headerShown: false,
                            title: 'Manage Page',
                        }}
                    />

                    {/*<Stack.Screen*/}
                    {/*    name="Main"*/}
                    {/*    component={Main}*/}
                    {/*    options={{*/}
                    {/*        headerShown: false,*/}
                    {/*        title: 'Main Page',*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <Stack.Screen
                        name="Details"
                        component={Details}
                        options={{
                            headerShown: false,
                            title: 'Details Page',
                        }}
                    />

                    <Stack.Screen name={'Main'} options={{ headerShown: false }}>
                        {() => (
                            <Tab.Navigator
                                screenOptions={({ route }) => ({
                                    tabBarActiveTintColor: "#CD661D",
                                    tabBarInactiveTintColor: "gray",

                                    tabBarIcon: ({ focused, size, color }) => {
                                        let iconName;
                                        if (route.name === 'Search') {
                                            iconName = focused ? 'file-find' : 'file-find-outline';
                                        } else if (route.name === 'Portfolio') {
                                            iconName = focused ? 'view-list' : 'view-list-outline';
                                        }
                                        return (
                                            <MaterialCommunityIcons
                                                name={iconName}
                                                color={"#CD6600"}
                                                size={size}
                                                tabBarBadgeStyle = {"black"}
                                            />
                                        );
                                    },
                                })}>
                                <Tab.Screen
                                    name="Search"
                                    component={Search}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Tab.Screen
                                    name="Portfolio"
                                    component={Portfolio}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                            </Tab.Navigator>
                        )}
                    </Stack.Screen>


                </Stack.Navigator>
            </NavigationContainer>

        )
    }
}