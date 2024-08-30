import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Check, Trash } from "@tamagui/lucide-icons";
import _ from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import {
  Adapt,
  AlertDialog,
  Button,
  Input,
  Select,
  Sheet,
  Spinner,
  Text,
  TextArea,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";
import { ICategory } from "../store";

export const CustomInput: FC<{
  heading: string;
  value: string | number;
  onChangeText: (text: string) => void;
  isInvalid: boolean;
  errMsg: string | undefined;
  placeholder: string;
  isTextArea?: boolean;
}> = ({
  heading,
  value,
  onChangeText,
  isInvalid,
  errMsg,
  placeholder,
  isTextArea = false,
}) => {
  return (
    <View mb="$2">
      <Text>{_.upperFirst(heading)}</Text>

      {isTextArea ? (
        <TextArea
          placeholder={placeholder}
          value={_.toString(value)}
          onChangeText={onChangeText}
          borderColor={isInvalid ? "$red9" : undefined}
          textAlignVertical="top"
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={_.toString(value)}
          onChangeText={onChangeText}
          borderColor={isInvalid ? "$red9" : undefined}
        />
      )}

      {isInvalid && <Text color="$red9">{errMsg}</Text>}
    </View>
  );
};

export const CustomDatePicker: FC<{
  heading: string;
  value: string | number;
  setFieldValue: (name: string, value: string) => void;
  isInvalid: boolean;
  errMsg: string | undefined;
  placeholder: string;
  fieldName: string;
}> = ({
  heading,
  value,
  setFieldValue,
  isInvalid,
  errMsg,
  placeholder,
  fieldName,
}) => {
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      setFieldValue(fieldName, moment(date).toDate().toISOString());
    }
  };

  const handlePress = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: handleDateChange,
      mode: "date",
      is24Hour: true,
    });
  };

  return (
    <View mb="$2">
      <Text>{_.upperFirst(heading)}</Text>
      <Pressable onPress={handlePress}>
        <Input
          placeholder={placeholder}
          value={
            moment(value).isValid()
              ? _.toString(moment(value).format("DD/MM/YYYY"))
              : undefined
          }
          borderColor={isInvalid ? "$red9" : undefined}
          disabled={true}
        />
      </Pressable>
      {isInvalid && <Text color="$red9">{errMsg}</Text>}
    </View>
  );
};

export const CustomSelectCategory: FC<{
  heading: string;
  value: string | number;
  isInvalid: boolean;
  errMsg: string | undefined;
  placeholder: string;
  setFieldValue: (name: string, value: string) => void;
  fieldName: string;
  options: ICategory[];
}> = ({
  heading,
  value,
  fieldName,
  setFieldValue,
  isInvalid,
  errMsg,
  placeholder,
  options,
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const handleChange = (value: string) => {
    setFieldValue(fieldName, value);
  };

  return (
    <>
      <View mb="$2" w="100%">
        <Text>{_.upperFirst(heading)}</Text>
      </View>

      <Select onValueChange={handleChange} value={_.toString(value)}>
        <Select.Trigger borderColor={isInvalid ? "$red9" : undefined}>
          <Select.Value
            color={value ? undefined : theme.color9["val"]}
            placeholder={placeholder}
          />
        </Select.Trigger>
        {isInvalid && <Text color="$red9">{errMsg}</Text>}

        <Adapt when="sm" platform="touch">
          <Sheet
            dismissOnSnapToBottom
            animationConfig={{
              type: "spring",
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}
          >
            <Sheet.Frame w={width}>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.Viewport>
            <Select.Group>
              {useMemo(
                () =>
                  options
                    .filter((item) => item._active === true)
                    .map((item, i) => {
                      return (
                        <Select.Item index={i} key={item.name} value={item._id}>
                          <Select.ItemText>{item.name}</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={16} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      );
                    }),
                [options]
              )}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>
    </>
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

export const CofirmationButton: FC<{
  onPress: VoidFunction;
  title: string;
  subtitle: string;
}> = ({ onPress, subtitle, title }) => {
  return (
    <>
      <AlertDialog native>
        <AlertDialog.Trigger asChild>
          <Button size="$3" p="$0" px="$2.5" icon={<Trash mb="$1" />} />
        </AlertDialog.Trigger>

        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack space>
              <AlertDialog.Title>{title}</AlertDialog.Title>
              <AlertDialog.Description>{subtitle}</AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action onPress={onPress} asChild>
                  <Button theme="active">Accept</Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </>
  );
};
