import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Paragraph, YStack } from "tamagui";

export default function ModalScreen() {
	return (
		<>
			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
			<YStack backgroundColor={"$background"} f={1} justifyContent="center">
				<Paragraph>test</Paragraph>
			</YStack>
		</>
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
