// Read the text out of an image, using the Vision framework macOS already has.
//
// A stopgap. Claude Code can normally look at a pasted image directly, but once
// a conversation has accumulated enough of them the API refuses every further
// image read regardless of size. This gets the words out so work can continue
// without restarting the session.
//
//   swift scripts/ocr.swift <image-path>
//
// Prints one line per recognised block, top to bottom, with its position as a
// fraction of the image so layout is still readable from the output.

import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else {
    FileHandle.standardError.write("usage: swift ocr.swift <image-path>\n".data(using: .utf8)!)
    exit(2)
}

let path = CommandLine.arguments[1]
guard let image = NSImage(contentsOfFile: path),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    FileHandle.standardError.write("could not open image: \(path)\n".data(using: .utf8)!)
    exit(1)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do {
    try handler.perform([request])
} catch {
    FileHandle.standardError.write("vision failed: \(error)\n".data(using: .utf8)!)
    exit(1)
}

let results = request.results ?? []

// Vision returns origin-at-bottom-left, so flip y to read top-down like a page.
let blocks = results.compactMap { obs -> (y: Double, x: Double, h: Double, text: String)? in
    guard let top = obs.topCandidates(1).first else { return nil }
    let b = obs.boundingBox
    return (y: 1 - Double(b.origin.y) - Double(b.height),
            x: Double(b.origin.x),
            h: Double(b.height),
            text: top.string)
}.sorted { $0.y < $1.y }

print("\(blocks.count) text block(s)\n")
for b in blocks {
    let pos = String(format: "y%3.0f%% x%3.0f%% h%4.1f%%", b.y * 100, b.x * 100, b.h * 100)
    print("[\(pos)]  \(b.text)")
}
