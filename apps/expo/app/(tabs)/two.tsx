import { StyleSheet } from "react-native";
import { Paragraph, YStack } from "tamagui";

export default function TabTwoScreen() {
	return (
		<YStack backgroundColor={"$background"} f={1} justifyContent="center">
			<Paragraph>test</Paragraph>
		</YStack>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
