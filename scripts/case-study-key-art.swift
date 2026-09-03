// Key art compositor for the case study heroes.
//
// !! FOUR OF THE FIVE HEROES DID NOT COME FROM HERE !!
//
// Japan Pro, Dubai, the US and the Africa study all carry artwork the client
// supplied. This script exists for the case the India study ran into, where a
// study is written up and no art comes with it, and it reproduces the layout
// those four share rather than inventing one: a navy panel on the left holding
// a headline, a subhead and a column of capability rows, with a photograph
// bleeding in from the right under a navy wash.
//
// Prefer the client's own artwork every time it is on offer. This is the
// fallback, and a hero built here says so in the comment beside its entry in
// content/case-studies.ts, along with where the photograph came from and under
// what licence.
//
// The numbers below were measured off the existing four rather than chosen:
// the 1152 by 768 canvas, the 78px left margin, the navy sampled at #101f33 to
// #15213b, the row rhythm, and the panel edge at x 0.642. Changing one of them
// moves this hero out of the set.
//
// Canvas is already 3:2, so nothing has to be cropped by the template. See the
// Japan Pro entry in content/case-studies.ts for why that matters, and for the
// rule that replacing a published image means renaming it.
//
// The headline, subhead and rows are edited in this file, near the bottom.
//
// Usage:
//   swift scripts/case-study-key-art.swift <photo.jpg> <out.png>
// then convert to webp, which is what the site serves:
//   node -e 'import("sharp").then(s => s.default("out.png")
//     .flatten({background:"#0e1c31"}).webp({quality:82})
//     .toFile("public/case-studies/<slug>-key-art.webp"))'

import AppKit
import CoreGraphics
import Foundation

let W: CGFloat = 1152
let H: CGFloat = 768

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: keyart.swift <photo> <out.png>\n".data(using: .utf8)!)
    exit(1)
}
let photoPath = args[1]
let outPath = args[2]

// --- Palette, sampled off the existing four -------------------------------
// Left panel runs #101f33 to #15213b across the set. The wash over the photo
// is the same navy at a lower alpha rather than a second colour.
func rgb(_ hex: UInt32, _ a: CGFloat = 1) -> CGColor {
    CGColor(
        red: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: a)
}

let navyTop = rgb(0x0e1c31)
let navyBottom = rgb(0x16273f)
let white = rgb(0xffffff)
let subheadColour = rgb(0xdbe2ec)
let bodyColour = rgb(0xc3cddb)

// --- Context ---------------------------------------------------------------
let cs = CGColorSpaceCreateDeviceRGB()
guard
    let ctx = CGContext(
        data: nil, width: Int(W), height: Int(H), bitsPerComponent: 8, bytesPerRow: 0,
        space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
else { exit(1) }

// Work in a top-left origin space so the layout numbers read like CSS.
ctx.translateBy(x: 0, y: H)
ctx.scaleBy(x: 1, y: -1)

// --- The photograph --------------------------------------------------------
// Scaled to cover and anchored right of centre, so the dense part of the
// skyline lands in the band the wash leaves visible.
guard let photo = NSImage(contentsOfFile: photoPath),
    let cgPhoto = photo.cgImage(forProposedRect: nil, context: nil, hints: nil)
else {
    FileHandle.standardError.write("cannot read photo\n".data(using: .utf8)!)
    exit(1)
}

// Zoom past cover and place by hand. Only the band from x 0.64 to the right
// edge is ever visible, so the framing that matters is which part of the
// skyline lands in that band rather than how the photograph reads whole.
// photoX and photoY are the canvas coordinates of the picture's top left
// corner, so both go negative as it is pushed off frame.
let photoZoom: CGFloat = 1.2
let photoX: CGFloat = 83
let photoY: CGFloat = -130

let pw = CGFloat(cgPhoto.width)
let ph = CGFloat(cgPhoto.height)
let scale = max(W / pw, H / ph) * photoZoom
let dw = pw * scale
let dh = ph * scale

ctx.saveGState()
ctx.translateBy(x: 0, y: H)
ctx.scaleBy(x: 1, y: -1)
// The y here is measured from the bottom, so the sign of photoY is flipped to
// keep it reading as "move the picture down" at the call site.
ctx.draw(cgPhoto, in: CGRect(x: photoX, y: H - dh - photoY, width: dw, height: dh))
ctx.restoreGState()

// The four existing heroes are all night or late evening photographs. This one
// is golden hour and reads far too pale against them, so it is graded down
// before the wash goes on. Multiply rather than a flat overlay: it takes the
// haze out of the sky without flattening the lit faces of the towers.
ctx.saveGState()
ctx.setBlendMode(.multiply)
ctx.setFillColor(rgb(0x8093b4))
ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
ctx.restoreGState()

// --- The navy wash ---------------------------------------------------------
// Solid across the text column, ramping down, then a hard step at 0.642 where
// the panel edge sits on all four of the existing heroes.
func drawHorizontalWash() {
    let stops: [(CGFloat, CGFloat)] = [
        (0.00, 1.00),
        (0.43, 1.00),
        (0.635, 0.80),
        (0.6415, 0.80),
        (0.6425, 0.32),
        (1.00, 0.22),
    ]
    var colours: [CGColor] = []
    var locations: [CGFloat] = []
    for (loc, alpha) in stops {
        // The wash carries the panel's own vertical gradient, approximated at
        // its midpoint, so the two never disagree on hue.
        colours.append(rgb(0x121f36, alpha))
        locations.append(loc)
    }
    guard
        let g = CGGradient(colorsSpace: cs, colors: colours as CFArray, locations: &locations)
    else { return }
    ctx.drawLinearGradient(
        g, start: CGPoint(x: 0, y: 0), end: CGPoint(x: W, y: 0), options: [])
}

// The panel's vertical gradient goes down first, under the wash, so the left
// column reads as one flat field rather than as a photo that has been hidden.
func drawPanelGradient() {
    var locations: [CGFloat] = [0, 1]
    guard
        let g = CGGradient(
            colorsSpace: cs, colors: [navyTop, navyBottom] as CFArray, locations: &locations)
    else { return }
    ctx.saveGState()
    ctx.clip(to: CGRect(x: 0, y: 0, width: W * 0.66, height: H))
    ctx.drawLinearGradient(
        g, start: CGPoint(x: 0, y: 0), end: CGPoint(x: 0, y: H), options: [])
    ctx.restoreGState()
}

drawHorizontalWash()
drawPanelGradient()

// A last darkening into the bottom right, which every one of the four has.
func drawBottomVignette() {
    var locations: [CGFloat] = [0, 1]
    guard
        let g = CGGradient(
            colorsSpace: cs, colors: [rgb(0x0a1524, 0), rgb(0x0a1524, 0.55)] as CFArray,
            locations: &locations)
    else { return }
    ctx.drawLinearGradient(
        g, start: CGPoint(x: 0, y: H * 0.55), end: CGPoint(x: 0, y: H), options: [])
}
drawBottomVignette()

// --- Text ------------------------------------------------------------------
let nsctx = NSGraphicsContext(cgContext: ctx, flipped: true)
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = nsctx

func draw(
    _ text: String, x: CGFloat, y: CGFloat, size: CGFloat, weight: NSFont.Weight,
    colour: CGColor, kern: CGFloat = 0
) {
    let font = NSFont.systemFont(ofSize: size, weight: weight)
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: NSColor(cgColor: colour) ?? .white,
        .kern: kern,
    ]
    (text as NSString).draw(at: CGPoint(x: x, y: y), withAttributes: attrs)
}

let marginX: CGFloat = 78

// Headline, two lines, matching "AFRICA ALL-IN-ONE / PLATFORM".
draw("INDIA HEALTHCARE", x: marginX, y: 62, size: 47, weight: .bold, colour: white, kern: 0.4)
draw("PLATFORM", x: marginX, y: 117, size: 47, weight: .bold, colour: white, kern: 0.4)

// Subhead.
draw(
    "Connected to the National Health Record", x: marginX, y: 184, size: 22, weight: .regular,
    colour: subheadColour)

// --- Icons -----------------------------------------------------------------
// Drawn as stroked paths in a 64 by 64 box so a row can be moved without
// touching the geometry. Same weight and cap style as the line icons on the
// other four.
// The glyphs are drawn in a 64 box and then scaled up slightly, which is how
// they end up weighted like the icons on the other four rather than lighter.
let iconScale: CGFloat = 1.08

func strokePath(_ build: (CGMutablePath) -> Void, at origin: CGPoint, width: CGFloat = 2.4) {
    let p = CGMutablePath()
    build(p)
    ctx.saveGState()
    ctx.translateBy(x: origin.x, y: origin.y)
    ctx.scaleBy(x: iconScale, y: iconScale)
    ctx.setStrokeColor(white)
    ctx.setLineWidth(width / iconScale)
    ctx.setLineCap(.round)
    ctx.setLineJoin(.round)
    ctx.addPath(p)
    ctx.strokePath()
    ctx.restoreGState()
}

// A microphone with two sound arcs. The intake is a phone call, so this is the
// one icon that has to read instantly.
func iconVoice(_ p: CGMutablePath) {
    p.addRoundedRect(in: CGRect(x: 25, y: 6, width: 15, height: 29), cornerWidth: 7.5, cornerHeight: 7.5)
    p.move(to: CGPoint(x: 17, y: 29))
    p.addArc(
        center: CGPoint(x: 32.5, y: 29), radius: 15.5, startAngle: .pi, endAngle: 0,
        clockwise: true)
    p.move(to: CGPoint(x: 32.5, y: 44.5))
    p.addLine(to: CGPoint(x: 32.5, y: 54))
    p.move(to: CGPoint(x: 22, y: 54))
    p.addLine(to: CGPoint(x: 43, y: 54))
    // Two waves off the right hand side.
    p.move(to: CGPoint(x: 50, y: 14))
    p.addArc(
        center: CGPoint(x: 44, y: 20.5), radius: 9, startAngle: -.pi / 4, endAngle: .pi / 4,
        clockwise: false)
    p.move(to: CGPoint(x: 57, y: 10))
    p.addArc(
        center: CGPoint(x: 44, y: 20.5), radius: 16.5, startAngle: -.pi / 4, endAngle: .pi / 4,
        clockwise: false)
}

// One request splitting into three destinations.
func iconRouting(_ p: CGMutablePath) {
    p.addEllipse(in: CGRect(x: 4, y: 24, width: 12, height: 12))
    p.addEllipse(in: CGRect(x: 48, y: 4, width: 12, height: 12))
    p.addEllipse(in: CGRect(x: 48, y: 24, width: 12, height: 12))
    p.addEllipse(in: CGRect(x: 48, y: 44, width: 12, height: 12))
    p.move(to: CGPoint(x: 16, y: 30))
    p.addLine(to: CGPoint(x: 32, y: 30))
    p.move(to: CGPoint(x: 32, y: 10))
    p.addLine(to: CGPoint(x: 32, y: 50))
    p.move(to: CGPoint(x: 32, y: 10))
    p.addLine(to: CGPoint(x: 48, y: 10))
    p.move(to: CGPoint(x: 32, y: 30))
    p.addLine(to: CGPoint(x: 48, y: 30))
    p.move(to: CGPoint(x: 32, y: 50))
    p.addLine(to: CGPoint(x: 48, y: 50))
}

// A patient record with a medical cross, filed rather than held.
func iconRecord(_ p: CGMutablePath) {
    p.move(to: CGPoint(x: 8, y: 5))
    p.addLine(to: CGPoint(x: 42, y: 5))
    p.addLine(to: CGPoint(x: 56, y: 19))
    p.addLine(to: CGPoint(x: 56, y: 59))
    p.addLine(to: CGPoint(x: 8, y: 59))
    p.closeSubpath()
    p.move(to: CGPoint(x: 42, y: 5))
    p.addLine(to: CGPoint(x: 42, y: 19))
    p.addLine(to: CGPoint(x: 56, y: 19))
    // The cross.
    p.move(to: CGPoint(x: 32, y: 28))
    p.addLine(to: CGPoint(x: 32, y: 50))
    p.move(to: CGPoint(x: 21, y: 39))
    p.addLine(to: CGPoint(x: 43, y: 39))
}

// A monitor and a phone, which is the website and the app.
func iconSurfaces(_ p: CGMutablePath) {
    p.addRoundedRect(
        in: CGRect(x: 4, y: 10, width: 44, height: 31), cornerWidth: 3.5, cornerHeight: 3.5)
    p.move(to: CGPoint(x: 18, y: 48))
    p.addLine(to: CGPoint(x: 34, y: 48))
    p.move(to: CGPoint(x: 26, y: 41))
    p.addLine(to: CGPoint(x: 26, y: 48))
    p.addRoundedRect(
        in: CGRect(x: 40, y: 27, width: 20, height: 33), cornerWidth: 4, cornerHeight: 4)
    p.move(to: CGPoint(x: 46, y: 54.5))
    p.addLine(to: CGPoint(x: 54, y: 54.5))
}

// --- Rows ------------------------------------------------------------------
struct Row {
    let title: String
    let body: String
    let icon: (CGMutablePath) -> Void
}

let rows = [
    Row(
        title: "AI VOICE INTAKE", body: "Patients book by describing the problem",
        icon: iconVoice),
    Row(
        title: "SMART ROUTING", body: "Requests matched to the right provider",
        icon: iconRouting),
    Row(
        title: "ABDM INTEGRATION", body: "Records filed into the national system",
        icon: iconRecord),
    Row(
        title: "WEB AND MOBILE", body: "One platform behind both front doors",
        icon: iconSurfaces),
]

let firstRowTop: CGFloat = 258
let rowStep: CGFloat = 118
let textX: CGFloat = 213

for (i, row) in rows.enumerated() {
    let top = firstRowTop + CGFloat(i) * rowStep
    strokePath(row.icon, at: CGPoint(x: marginX, y: top))
    draw(row.title, x: textX, y: top + 4, size: 25, weight: .semibold, colour: white, kern: 0.5)
    draw(row.body, x: textX, y: top + 36, size: 18, weight: .regular, colour: bodyColour)
}

NSGraphicsContext.restoreGraphicsState()

// --- Write -----------------------------------------------------------------
guard let image = ctx.makeImage() else { exit(1) }
let rep = NSBitmapImageRep(cgImage: image)
guard let png = rep.representation(using: .png, properties: [:]) else { exit(1) }
try png.write(to: URL(fileURLWithPath: outPath))
print("wrote \(outPath)")
