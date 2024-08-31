import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Pen, Trash } from "@tamagui/lucide-icons";
import { useToggle } from "ahooks";
import _ from "lodash";
import React, { FC, useCallback, useState } from "react";
import {
  Button,
  Heading,
  Paragraph,
  ScrollView,
  Separator,
  View,
} from "tamagui";
import CreateOrUpdateCategory from "../component/CreateOrUpdateCategory";
import { ICategory, useAppStore } from "../store";

const RenderCategory: FC<{
  item: ICategory;
  toggle: VoidFunction;
  setEditId: (id: string) => void;
}> = ({ item, setEditId, toggle }) => {
  const removeCategory = useAppStore((state) => state.removeCategory);

  const handleEdit = () => {
    setEditId(item._id);
    toggle();
  };

  const handleDelete = () => {
    removeCategory(item._id);
  };

  return (
    <>
      <View
        key={item._id}
        flexDirection="row"
        alignItems="center"
        gap="$3"
        my="$1.5"
        justifyContent="space-between"
      >
        <View>
          <Paragraph fontSize="$5">{item.name}</Paragraph>
        </View>

        <View flexDirection="row" gap="$3">
          <Button
            onPress={handleEdit}
            size="$3"
            p="$0"
            px="$2.5"
            icon={<Pen mb="$1" />}
          />
          <Button
            onPress={handleDelete}
            size="$3"
            p="$0"
            px="$2.5"
            icon={<Trash mb="$1" />}
          />
        </View>
      </View>
    </>
  );
};

const Category = () => {
  const incomeCategory = useAppStore((state) => state.incomeCategory);
  const expensesCategory = useAppStore((state) => state.expensesCategory);

  const [isOpen, { toggle }] = useToggle(false);
  const [editId, setEditId] = useState("");
  const [type, setType] = useState<"" | "income" | "expense">("");

  const renderItem: ListRenderItem<ICategory> = useCallback(
    ({ item }) => (
      <RenderCategory item={item} toggle={toggle} setEditId={setEditId} />
    ),
    []
  );

  const openIncomeModal = () => {
    setType("income");
    toggle();
  };

  const openExpenseModal = () => {
    setType("expense");
    toggle();
  };

  return (
    <>
      <View flex={1} bg="$color2" px="$6">
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <View mt="$5">
            <Heading>Category</Heading>
          </View>
        </View>

        <Separator borderWidth="$0.5" my="$2.5" />

        <ScrollView
          flex={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          minHeight="80%"
        >
          <View flexDirection="row" justifyContent="space-between">
            <Paragraph fontSize="$6" my="$2">
              Income Source
            </Paragraph>

            <Button
              p="$0"
              px="$3"
              icon={<FontAwesome6 name="plus" size={16} color="black" />}
              onPress={openIncomeModal}
            />
          </View>

          <Separator borderWidth="$0.5" my="$2.5" />

          {_.isArray(incomeCategory) && !_.isEmpty(incomeCategory) && (
            <FlashList
              data={_.filter(incomeCategory, { _active: true })}
              estimatedItemSize={incomeCategory.length}
              renderItem={renderItem}
            />
          )}

          <Separator borderWidth="$0.5" my="$2.5" />

          <View flexDirection="row" justifyContent="space-between">
            <Paragraph fontSize="$6" my="$2">
              Expense Source
            </Paragraph>

            <Button
              p="$0"
              px="$3"
              icon={<FontAwesome6 name="plus" size={16} color="black" />}
              onPress={openExpenseModal}
            />
          </View>

          <Separator borderWidth="$0.5" my="$2.5" />

          {_.isArray(expensesCategory) && !_.isEmpty(expensesCategory) && (
            <FlashList
              data={_.filter(expensesCategory, { _active: true })}
              estimatedItemSize={expensesCategory.length}
              renderItem={renderItem}
            />
          )}

          <View mb="$6" />
        </ScrollView>
      </View>

      <CreateOrUpdateCategory
        isOpen={isOpen}
        toggle={toggle}
        id={editId}
        setEditId={setEditId}
        type={type}
      />
    </>
  );
};

export default Category;
