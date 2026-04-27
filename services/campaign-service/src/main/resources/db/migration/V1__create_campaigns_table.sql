-- V1: Initial campaigns schema

CREATE TABLE IF NOT EXISTS campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)        NOT NULL,
    description     VARCHAR(1000),
    advertiser_id   VARCHAR(255)        NOT NULL,
    status          VARCHAR(50)         NOT NULL DEFAULT 'DRAFT',
    total_budget    NUMERIC(15, 2)      NOT NULL,
    spent_budget    NUMERIC(15, 2)      NOT NULL DEFAULT 0,
    daily_budget_cap NUMERIC(15, 2),
    objective       VARCHAR(50)         NOT NULL,
    start_date      TIMESTAMP           NOT NULL,
    end_date        TIMESTAMP,
    audience_config JSONB,
    creative_ids    JSONB,
    version         BIGINT              NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_advertiser_id ON campaigns(advertiser_id);
CREATE INDEX idx_campaigns_status        ON campaigns(status);
CREATE INDEX idx_campaigns_start_date    ON campaigns(start_date);
CREATE INDEX idx_campaigns_advertiser_status ON campaigns(advertiser_id, status);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE campaigns IS 'Core campaign records — source of truth for campaign state';
COMMENT ON COLUMN campaigns.audience_config IS 'JSON targeting config: age, location, interests, etc.';
COMMENT ON COLUMN campaigns.version IS 'Optimistic lock version — prevents concurrent budget over-spend';
