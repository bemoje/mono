CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin" text NOT NULL,
	"pathname" text NOT NULL,
	"time" integer NOT NULL,
	"heading" text NOT NULL,
	"summary" text
);
--> statement-breakpoint
CREATE TABLE "user_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"event" text NOT NULL,
	"articleId" integer
);
--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_articleId_articles_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;