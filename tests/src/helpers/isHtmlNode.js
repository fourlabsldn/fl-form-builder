export default function isHtmlNode(node) {
  return node.setAttribute && node.appendChild;
}
