import os
from http.server import SimpleHTTPRequestHandler, HTTPServer

class MeuServidor(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.end_headers()
        mensagem = "<h1>Deploy realizado com sucesso! Aguardando o código da equipe.</h1>"
        self.wfile.write(mensagem.encode("utf-8"))

if __name__ == "__main__":
    # O Render define automaticamente qual porta o sistema deve usar
    porta = int(os.environ.get("PORT", 8000))
    servidor = HTTPServer(("0.0.0.0", porta), MeuServidor)
    print(f"Servidor online na porta {porta}...")
    servidor.serve_forever()
