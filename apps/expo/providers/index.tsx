import { SafeAreaProvider } from "./safe-area";
import { TRPCProvider } from "./trpc";
import { TamaguiProvider } from "./tamagui";

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<TamaguiProvider>
			<SafeAreaProvider>
				<TRPCProvider>{children}</TRPCProvider>
			</SafeAreaProvider>
		</TamaguiProvider>
	);
}
