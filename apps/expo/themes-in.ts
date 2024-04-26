import { createSoftenMask, createThemeBuilder } from "@tamagui/theme-builder";

const themesBuilder = createThemeBuilder()
	.addPalettes({
		dark: [
			"#000",
			"#09090b",
			"#18181B",
			"#27272A",
			"#3F3F46",
			"#52525B",
			"#71717A",
			"#A1A1AA",
			"#D4D4D8",
			"#E4E4E7",
			"#F4F4F5",
			"#FAFAFA",
		],
		light: [
			"#FAFAFA",
			"#F4F4F5",
			"#E4E4E7",
			"#D4D4D8",
			"#A1A1AA",
			"#71717A",
			"#52525B",
			"#3F3F46",
			"#27272A",
			"#18181B",
			"#09090b",
			"#000",
		],
	})
	.addTemplates({
		base: {
			background: 2,
			backgroundHover: 3,
			backgroundPress: 4,
			backgroundFocus: 5,
			backgroundStrong: 1,
			backgroundTransparent: 0,
			color: -1,
			colorHover: -2,
			colorPress: -1,
			colorFocus: -2,
			colorTransparent: -0,
			borderColor: 5,
			borderColorHover: 6,
			borderColorFocus: 4,
			borderColorPress: 5,
			placeholderColor: -4,
		},
	})
	.addMasks({
		soften: createSoftenMask(),
	})
	.addThemes({
		light: {
			template: "base",
			palette: "light",
		},
		dark: {
			template: "base",
			palette: "dark",
		},
	})
	.addChildThemes({
		subtle: {
			mask: "soften",
		},
	});

export const themes = themesBuilder.build();
