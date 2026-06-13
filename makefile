PORT ?= 8000

.PHONY: dev build lint lint-fix fresh setup

dev:
	php artisan serve --port=$(PORT) & pnpm dev

dev-host:
	php artisan serve --host=0.0.0.0 --port=$(PORT) & pnpm dev --host=0.0.0.0

build:
	pnpm build

lint:
	pnpm lint

lint-fix:
	pnpm lint:fix

fresh:
	php artisan migrate:fresh --seed

setup:
	composer install
	pnpm install
	cp -n .env.example .env || true
	php artisan key:generate
	php artisan migrate --force
	pnpm build
