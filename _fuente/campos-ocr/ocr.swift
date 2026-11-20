// OCR de capturas con Vision (macOS). Uso: swift ocr.swift <img>... > salida.jsonl
// Una línea JSON por imagen: {"f": ruta, "w":px, "h":px, "t":[{"s":texto,"x":%,"y":%,"w":%,"h":%}]}
import Foundation
import Vision
import ImageIO

for path in CommandLine.arguments.dropFirst() {
  guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil),
        let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
    FileHandle.standardError.write("no se puede leer \(path)\n".data(using: .utf8)!); continue
  }
  let req = VNRecognizeTextRequest()
  req.recognitionLevel = .accurate
  req.recognitionLanguages = ["es-ES", "en-US"]
  req.usesLanguageCorrection = false
  try? VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
  var out: [[String: Any]] = []
  for o in req.results ?? [] {
    guard let c = o.topCandidates(1).first else { continue }
    let b = o.boundingBox
    out.append(["s": c.string, "x": b.minX * 100, "y": (1 - b.maxY) * 100, "w": b.width * 100, "h": b.height * 100])
  }
  let line: [String: Any] = ["f": path, "w": img.width, "h": img.height, "t": out]
  let d = try! JSONSerialization.data(withJSONObject: line)
  print(String(data: d, encoding: .utf8)!)
}
