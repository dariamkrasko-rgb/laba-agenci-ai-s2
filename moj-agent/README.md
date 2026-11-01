# Mój chatbot

Chatbot Next.js App Router z TypeScript, strumieniowymi odpowiedziami OpenRouter i historią bieżącej rozmowy. Historia znika po odświeżeniu strony; aplikacja nie używa bazy danych.

## Uruchomienie na macOS

Zainstaluj Node.js LTS (minimum 22, zalecana wersja 24) oraz Git zgodnie z materiałami kursu w katalogu nadrzędnym.

Pobierz całe repozytorium:

```bash
git clone https://github.com/dariamkrasko-rgb/laba-agenci-ai-s2.git
cd laba-agenci-ai-s2/moj-agent
npm ci
cp -n .env.example .env.local
open -e .env.local
```

W otwartym pliku `.env.local` wpisz klucz otrzymany od LABA i dokładny identyfikator modelu od prowadzącego po znakach `=`:

```dotenv
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

Zapisz plik w TextEdit (`Cmd+S`) i zamknij edytor. Nie wysyłaj wartości klucza na czat ani do GitHub. Klucz jest odczytywany wyłącznie w serwerowym `/api/chat`; `.env.local` i `.env` są wykluczone z Git. Następnie uruchom serwer:

```bash
npm run dev
```

Jeżeli repozytorium zostało już pobrane, otwórz jego katalog, wykonaj `git pull`, a następnie przejdź do `moj-agent`. Jeśli masz własne niezapisane zmiany, zachowaj je przed aktualizacją.

Otwórz w przeglądarce na tym samym komputerze adres wypisany przez serwer, zwykle `http://localhost:3000`. Pozostaw Terminal otwarty. `Ctrl+C` zatrzymuje serwer. Po zmianie `.env.local` zatrzymaj i ponownie uruchom serwer. Brak konfiguracji powoduje czytelny komunikat po wysłaniu wiadomości, bez wywołania modelu.

Polecenia npm wykonuj w folderze `moj-agent`, w którym znajduje się `package.json`. Katalog nadrzędny zawiera materiały kursowe.

## Sprawdzenie projektu

```bash
npm run build
npm run typecheck
npm test
```

Nie zapisuj w repozytorium kluczy, haseł ani plików `.env`. Foldery `node_modules` i `.next` są generowane lokalnie i wykluczone z Git.

Testy używają wyłącznie symulowanego dostawcy i sztucznego klucza; nie wykonują płatnych wywołań. Pierwszy rzeczywisty test wykonaj samodzielnie w przeglądarce: wyślij „Mam na imię Alex”, a następnie „Jak mam na imię?”. Sprawdź stopniowe pojawianie się odpowiedzi i pamiętanie imienia. Przycisk jest zablokowany dla pustej wiadomości oraz podczas generowania.

## Zgodność SDK

Użyto `ai@7.0.159`, `@ai-sdk/react@4.0.163`, `@openrouter/ai-sdk-provider@3.1.0` i Zod 4. OpenRouter 3 wspiera AI SDK 7; pakiet React 4.0.163 zależy od tej samej wersji `ai`. Zachowano i zaktualizowano `package-lock.json`. Do testów zalecany Node.js 24.

Oficjalna dokumentacja: [Vercel — Next.js App Router](https://github.com/vercel/ai/blob/main/content/docs/02-getting-started/02-nextjs-app-router.mdx), [OpenRouter — zgodność i konfiguracja](https://github.com/OpenRouterTeam/ai-sdk-provider#readme).
