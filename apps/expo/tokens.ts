import { zinc } from "./colors/zinc";
import { Variable } from "@tamagui/web";
import { darkColors, lightColors, tokens } from "@tamagui/themes";
import { createTokens } from "tamagui";

export const color = {
	...postfixObjKeys(lightColors, "Light"),
	...postfixObjKeys(darkColors, "Dark"),
	...zinc,
};

function postfixObjKeys<
	A extends { [key: string]: Variable<string> | string },
	B extends string,
>(
	obj: A,
	postfix: B,
): {
	[Key in `${keyof A extends string ? keyof A : never}${B}`]:
		| Variable<string>
		| string;
} {
	return Object.fromEntries(
		Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v]),
	) as any;
}

const customToken = createTokens({
	...tokens,
	color: {
		...color,
	},
});

export default customToken;
