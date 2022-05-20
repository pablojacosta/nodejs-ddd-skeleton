SUBDIRS = src/application/api/controller/ \
src/application/api/validator/ \
src/domain/entity/ \
src/domain/repository/ \
src/domain/mapper/ \
src/domain/service/ \
src/infrastructure/repository/ \
src/tests/api/ \
src/tests/unit/service/ \
postman/collections/ \

.PHONY: run test attach logs clean_example

run:
	docker-compose up -d

stop:
	docker-compose down	

test:
	docker-compose -f docker-compose.yml -f docker-compose.api-test.yml up --exit-code-from app

attach:
	docker-compose logs -f app

logs:
	docker-compose logs -f app

clean_example:
	@echo "Cleaning example dictories..."
	for dir in $(SUBDIRS); do \
		rm -rf $$dir; \
	done

	@echo "Updating loader.ts..."
	sed -i '' '1,15d' src/application/config/ioc/loader.ts

	@echo "Updating types.ts..."
	sed -i '' '5,11d' src/application/config/ioc/types.ts
