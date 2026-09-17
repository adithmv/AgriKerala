begin;

alter table public.orders add column if not exists address text;
alter table public.planner_logs add column if not exists duration_ms integer;

commit;
