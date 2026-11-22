// Снимок страницы через WebKit без окна на экране.
// snap <url> <width> <out.png> [light|dark] [maxHeight, 0 = вся страница] [js до загрузки] [slice px] [ширина файла]
import Cocoa
import WebKit

let args = CommandLine.arguments
let url = URL(string: args[1])!
let width = CGFloat(Double(args[2])!)
let out = args[3]
let theme = args.count > 4 ? args[4] : "light"
let maxH = args.count > 5 ? CGFloat(Double(args[5])!) : 0
let extraJS = args.count > 6 ? args[6] : ""
let slice = args.count > 7 ? CGFloat(Double(args[7])!) : 0
let outW = args.count > 8 ? Double(args[8])! : 0
let viewportH: CGFloat = 900

final class Shooter: NSObject, WKNavigationDelegate {
  var web: WKWebView!
  var window: NSWindow!
  func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { self.shoot() }
  }
  func webView(_ w: WKWebView, didFail n: WKNavigation!, withError e: Error) { print("ERR", e); exit(1) }
  func webView(_ w: WKWebView, didFailProvisionalNavigation n: WKNavigation!, withError e: Error) { print("ERR", e); exit(1) }
  func shoot() {
    // vh замораживаем на высоте окна, чтобы первый экран не растягивался на всю высоту снимка
    let freeze = "document.documentElement.style.setProperty('--snap-vh', '\(Int(viewportH))px'); Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)"
    web.evaluateJavaScript(freeze) { r, _ in
      var h = CGFloat((r as? NSNumber)?.doubleValue ?? Double(viewportH))
      if maxH > 0 { h = min(h, maxH) }
      self.window.setContentSize(NSSize(width: width, height: h))
      self.web.frame = NSRect(x: 0, y: 0, width: width, height: h)
      DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        // части по slice px: out-0.png, out-1.png… (slice = 0: один файл)
        let step = slice > 0 ? slice : h
        var tops: [CGFloat] = []
        var y: CGFloat = 0
        while y < h { tops.append(y); y += step }
        func next(_ i: Int) {
          if i >= tops.count { exit(0) }
          let part = min(step, h - tops[i])
          let c = WKSnapshotConfiguration()
          c.rect = NSRect(x: 0, y: tops[i], width: width, height: part)
          c.snapshotWidth = NSNumber(value: Double(min(width, outW > 0 ? outW : width)))
          self.web.takeSnapshot(with: c) { img, err in
            guard let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
                  let png = rep.representation(using: .png, properties: [:]) else { print("ERR", err ?? "no image"); exit(1) }
            let name = slice > 0 ? out.replacingOccurrences(of: ".png", with: "-\(i).png") : out
            try! png.write(to: URL(fileURLWithPath: name))
            print("saved \(name) y=\(Int(tops[i])) h=\(Int(part)) of \(Int(h))")
            next(i + 1)
          }
        }
        next(0)
      }
    }
  }
}

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let cfg = WKWebViewConfiguration()
let pre = "try { localStorage.setItem('tpos.theme', '\(theme)'); } catch (e) {}\n" + extraJS
cfg.userContentController.addUserScript(WKUserScript(source: pre, injectionTime: .atDocumentStart, forMainFrameOnly: true))
let calm = "var s = document.createElement('style'); s.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }'; document.head.appendChild(s);"
cfg.userContentController.addUserScript(WKUserScript(source: calm, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
let rect = NSRect(x: -10000, y: -10000, width: width, height: viewportH)
let window = NSWindow(contentRect: rect, styleMask: [.borderless], backing: .buffered, defer: false)
let web = WKWebView(frame: NSRect(x: 0, y: 0, width: width, height: viewportH), configuration: cfg)
window.contentView = web
let shooter = Shooter()
shooter.web = web
shooter.window = window
web.navigationDelegate = shooter
if url.isFileURL { web.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent()) } else { web.load(URLRequest(url: url)) }
DispatchQueue.main.asyncAfter(deadline: .now() + 40) { print("ERR timeout"); exit(1) }
app.run()
