    import React from 'react';
    import { View, StyleSheet } from 'react-native';
    import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

    type RadialGradientCircleType = {
      size: number, 
      colors: string[], 
      cx: number, 
      cy: number, 
      r: number
    }

    const RadialGradientCircle = ({ size, colors, cx, cy, r }: RadialGradientCircleType) => {
      const radius = size / 2;
      const gradientId = 'radialGradientId';

      return (
        <View style={{ width: size, height: size }}>
          <Svg height={size} width={size} style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse" // Use userSpaceOnUse for precise positioning
                cx={cx !== undefined ? cx : radius} // Default to center if not provided
                cy={cy !== undefined ? cy : radius} // Default to center if not provided
                r={r !== undefined ? r : radius} // Default to radius if not provided
              >
                {colors.map((color: string, index: number) => (
                  <Stop
                    key={index}
                    offset={`${index / (colors.length - 1)}`} // Distribute stops evenly
                    stopColor={color}
                  />
                ))}
              </RadialGradient>
            </Defs>
            <Circle
              cx={radius}
              cy={radius}
              r={radius}
              fill={`url(#${gradientId})`}
            />
          </Svg>
        </View>
      );
    };

    export default RadialGradientCircle;