import { TamaguiProvider as TamaguiProviderOG } from "@tamagui/core";
import { config as tamaguiConfig } from "../../tamagui.config";

import "@tamagui/core/reset.css";
import "@tamagui/font-inter/css/400.css";
import "@tamagui/font-inter/css/700.css";

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig;
declare module "@tamagui/core" {
	// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
	interface TamaguiCustomConfig extends Conf {}
}

export const TamaguiProvider = ({
	children,
}: { children: React.ReactNode }): React.ReactNode => {
	return (
		<TamaguiProviderOG config={tamaguiConfig}>{children}</TamaguiProviderOG>
	);
};
