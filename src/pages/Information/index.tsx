import {View, Text, ScrollView} from 'react-native';
import React from 'react';

export default function Information() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="bg-black p-8 flex-1">
      <Text className="text-white font-sans-bold text-3xl">Infomation</Text>
      <Text className="text-white font-sans mt-4 text-lg">
        Welcome to Unilink, where connections happen effortlessly!
      </Text>
      <Text className="text-white font-sans-bold mt-4 text-xl">
        Our Mission
      </Text>
      <Text className="text-white font-sans text-lg mt-2">
        At Unilink, our mission is to bring people together through seamless and
        enjoyable communication. We believe in fostering meaningful connections,
        whether it's for work, study, or personal relationships. Unilink is
        designed to simplify your communication experience and make staying
        connected a breeze.
      </Text>
      <Text className="text-white font-sans-bold mt-4 text-xl">
        Instant Messaging
      </Text>
      <Text className="text-white font-sans text-lg mt-2">
        Unilink offers lightning-fast, real-time messaging to keep you connected
        with your friends, family, colleagues, and classmates. Say goodbye to
        delays and enjoy instant communication wherever you are.
      </Text>
      <Text className="text-white font-sans-bold mt-4 text-xl">
        Security And Privacy
      </Text>
      <Text className="text-white font-sans text-lg mt-2">
        Your privacy is our priority. Unilink employs robust security measures
        to ensure your conversations are private and secure. Rest easy knowing
        that your data is protected.
      </Text>
      <Text className="text-white font-sans-bold mt-4 text-xl">Contact Us</Text>
      <Text className="text-white font-sans text-lg mt-2">
        We'd love to hear from you! If you have any questions, suggestions, or
        feedback, feel free to reach out to our support team at
        imadanbhat@gmail.com.
      </Text>
      <Text className="font-sans text-white text-lg mt-4">
        Thank you for choosing Unilink. Stay connected, stay Unilinked!
      </Text>
      <Text className="font-sans-bold text-white text-lg mt-4 mb-12">
        *Madan Bhat*
      </Text>
    </ScrollView>
  );
}
