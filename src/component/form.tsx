import _ from "lodash";
import { FC } from "react";
import { Button, Input, Spinner, Text, View } from "tamagui";

export const CustomInput: FC<{
  heading: string;
  value: string | number;
  onChangeText: (text: string) => void;
  isInvalid: boolean;
  errMsg: string | undefined;
}> = ({ heading, value, onChangeText, isInvalid, errMsg }) => {
  return (
    <View mb="$2">
      <Text>{heading}</Text>
      <Input
        placeholder="Enter your name"
        value={_.toString(value)}
        onChangeText={onChangeText}
        borderColor={isInvalid ? "$red9" : undefined}
      />
      {isInvalid && <Text color="$red9">{errMsg}</Text>}
    </View>
  );
};

export const CustomButton: FC<{
  handleSubmit: Function;
  isSubmitting: boolean;
}> = ({ handleSubmit, isSubmitting }) => {
  return (
    <View mt="$2">
      <Button
        icon={isSubmitting ? <Spinner color="$color" /> : undefined}
        // @ts-ignore
        onPress={handleSubmit}
      >
        Submit
      </Button>
    </View>
  );
};
