type Theme = {
	background: string;
	backgroundHover: string;
	backgroundPress: string;
	backgroundFocus: string;
	backgroundStrong: string;
	backgroundTransparent: string;
	color: string;
	colorHover: string;
	colorPress: string;
	colorFocus: string;
	colorTransparent: string;
	borderColor: string;
	borderColorHover: string;
	borderColorFocus: string;
	borderColorPress: string;
	placeholderColor: string;
};

function t(a: [number, number][]) {
	let res: Record<string, string> = {};
	for (const [ki, vi] of a) {
		res[ks[ki] as string] = vs[vi] as string;
	}
	return res as Theme;
}
const vs = [
	"#E4E4E7",
	"#D4D4D8",
	"#A1A1AA",
	"#71717A",
	"#F4F4F5",
	"#FAFAFA",
	"#09090b",
	"#18181B",
	"#000",
	"#52525B",
	"#3F3F46",
	"#27272A",
];

const ks = [
	"background",
	"backgroundHover",
	"backgroundPress",
	"backgroundFocus",
	"backgroundStrong",
	"backgroundTransparent",
	"color",
	"colorHover",
	"colorPress",
	"colorFocus",
	"colorTransparent",
	"borderColor",
	"borderColorHover",
	"borderColorFocus",
	"borderColorPress",
	"placeholderColor",
];

const n1 = t([
	[0, 0],
	[1, 1],
	[2, 2],
	[3, 3],
	[4, 4],
	[5, 5],
	[6, 6],
	[7, 7],
	[8, 6],
	[9, 7],
	[10, 8],
	[11, 3],
	[12, 9],
	[13, 2],
	[14, 3],
	[15, 10],
]);

export const light = n1;
const n2 = t([
	[0, 7],
	[1, 11],
	[2, 10],
	[3, 9],
	[4, 6],
	[5, 8],
	[6, 4],
	[7, 0],
	[8, 4],
	[9, 0],
	[10, 5],
	[11, 9],
	[12, 3],
	[13, 10],
	[14, 9],
	[15, 2],
]);

export const dark = n2;
const n3 = t([
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 9],
	[4, 0],
	[5, 4],
	[6, 7],
	[7, 11],
	[8, 7],
	[9, 11],
	[10, 6],
	[11, 9],
	[12, 10],
	[13, 3],
	[14, 9],
	[15, 9],
]);

export const light_subtle = n3;
const n4 = t([
	[0, 11],
	[1, 10],
	[2, 9],
	[3, 3],
	[4, 7],
	[5, 6],
	[6, 0],
	[7, 1],
	[8, 0],
	[9, 1],
	[10, 4],
	[11, 3],
	[12, 2],
	[13, 9],
	[14, 3],
	[15, 3],
]);

export const dark_subtle = n4;
