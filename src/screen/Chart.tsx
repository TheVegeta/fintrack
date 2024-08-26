import React from "react";
import { Heading, Image, Paragraph, View } from "tamagui";

const Chart = () => {
  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="$color2"
      px="$6"
    >
      <Image
        source={require("../assets/Fall is coming-amico.png")}
        height={350}
        width={350}
      />

      <View>
        <Heading>Expense Analytics (Coming Soon)</Heading>
        <Paragraph>
          Stay tuned for a detailed breakdown of your expenses in the upcoming
          release.
        </Paragraph>
      </View>
    </View>
  );
};

export default Chart;
