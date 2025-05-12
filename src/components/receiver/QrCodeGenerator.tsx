import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = ({ text }: any) => {
  return (
    <View>
      <QRCode
        value={text}
        size={220}
      />
    </View>
  );
};

export default QRCodeGenerator;