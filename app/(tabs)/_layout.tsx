import { Feather } from '@expo/vector-icons'; // for a cleaner info icon
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb', // Tailwind blue-600
        tabBarInactiveTintColor: '#9ca3af', // Tailwind gray-400
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', // Tailwind gray-200
          height: 75,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerRight: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Feather
                    name="info"
                    size={22}
                    color="#4b5563" // Tailwind gray-700
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'To-Do List',
          tabBarIcon: ({ color }) => <TabBarIcon name="check-square" color={color} />,
        }}
      />
    </Tabs>
  );
}
