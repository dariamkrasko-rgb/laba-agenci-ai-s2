# Mój chatbot

Pierwszy krok kursu LABA: prosta strona Next.js App Router z TypeScript, pustym miejscem na rozmowę, polem wiadomości i przyciskiem „Wyślij”. Odpowiedzi AI nie są jeszcze podłączone. Klucze API nie są potrzebne.

## Uruchomienie na macOS

Zainstaluj Node.js LTS (minimum 22, zalecana wersja 24) oraz Git zgodnie z materiałami kursu w katalogu nadrzędnym.

Pobierz całe repozytorium:

```bash
git clone https://github.com/dariamkrasko-rgb/laba-agenci-ai-s2.git
cd laba-agenci-ai-s2/moj-agent
npm ci
npm run dev
```

Jeżeli repozytorium zostało już pobrane, otwórz jego katalog, wykonaj `git pull`, a następnie przejdź do `moj-agent`. Jeśli masz własne niezapisane zmiany, zachowaj je przed aktualizacją.

Otwórz w przeglądarce na tym samym komputerze adres wypisany przez serwer, zwykle `http://localhost:3000`. Pozostaw Terminal otwarty. `Ctrl+C` zatrzymuje serwer.

Polecenia npm wykonuj w folderze `moj-agent`, w którym znajduje się `package.json`. Katalog nadrzędny zawiera materiały kursowe.

## Sprawdzenie projektu

```bash
npm run build
npm run typecheck
```

Nie zapisuj w repozytorium kluczy, haseł ani plików `.env`. Foldery `node_modules` i `.next` są generowane lokalnie i wykluczone z Git.
