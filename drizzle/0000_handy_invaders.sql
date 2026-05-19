CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"secret_token" uuid NOT NULL,
	"completed_step_orders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_view_step_order" integer NOT NULL,
	"stuck" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_secret_token_unique" UNIQUE("secret_token")
);
--> statement-breakpoint
CREATE TABLE "workshop_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(128) NOT NULL,
	"tutor_step_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workshop_sessions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_session_id_workshop_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workshop_sessions"("id") ON DELETE cascade ON UPDATE no action;