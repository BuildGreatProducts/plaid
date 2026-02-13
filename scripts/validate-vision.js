#!/usr/bin/env node

/**
 * PLAID Vision Validator & Migrator
 * Validates that vision.json conforms to the expected schema.
 * Migrates older schema versions forward when --migrate is passed.
 *
 * Usage:
 *   node scripts/validate-vision.js [path-to-vision.json]
 *   node scripts/validate-vision.js --migrate [path-to-vision.json]
 *
 * Default path: ./vision.json
 *
 * Returns JSON:
 *   { valid: boolean, errors: string[], warnings: string[] }
 *   With --migrate also includes: { migrated: boolean, migrationsApplied: string[] }
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Schema version & migrations
// ---------------------------------------------------------------------------

const CURRENT_VERSION = '1.0';

/**
 * Migration registry. Each key is the version to migrate FROM.
 * The function receives a vision object and returns the transformed object
 * at the next version. Migrations are applied in sequence: 1.0 → 1.1 → 1.2.
 *
 * Example (uncomment and adapt when the first breaking change ships):
 *
 * const migrations = {
 *   '1.0': (vision) => {
 *     // 1.0 → 1.1: describe what changed
 *     //
 *     // e.g. remove redundant techStack.appType, add optional field
 *     // if (vision.techStack.appType) {
 *     //   if (!vision.product.platform) {
 *     //     vision.product.platform = vision.techStack.appType;
 *     //   }
 *     //   delete vision.techStack.appType;
 *     // }
 *     // if (!vision.product.newField) {
 *     //   vision.product.newField = '';
 *     // }
 *     vision.meta.version = '1.1';
 *     return vision;
 *   }
 * };
 */
const migrations = {};

/**
 * Apply all migrations needed to bring a vision object to CURRENT_VERSION.
 * Returns { success, vision, applied } or { success: false, error }.
 */
function migrate(vision) {
  const applied = [];

  while (vision.meta.version !== CURRENT_VERSION) {
    const fn = migrations[vision.meta.version];
    if (!fn) {
      return {
        success: false,
        error: `No migration path from version ${vision.meta.version} to ${CURRENT_VERSION}`
      };
    }
    const fromVersion = vision.meta.version;
    vision = fn(JSON.parse(JSON.stringify(vision))); // deep clone before mutating
    applied.push(`${fromVersion} → ${vision.meta.version}`);
  }

  if (applied.length > 0) {
    vision.meta.updatedAt = new Date().toISOString();
  }

  return { success: true, vision, applied };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validate(vision) {
  const errors = [];
  const warnings = [];

  // Required top-level keys
  const requiredSections = [
    'meta', 'creator', 'purpose', 'product',
    'audience', 'business', 'feeling', 'techStack', 'tooling'
  ];

  for (const section of requiredSections) {
    if (!vision[section]) {
      errors.push(`Missing required section: ${section}`);
    } else if (typeof vision[section] !== 'object') {
      errors.push(`Section "${section}" must be an object`);
    }
  }

  // If top-level sections are missing, bail early
  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // meta validation
  if (vision.meta) {
    checkString(vision.meta, 'createdAt', 'meta', errors);
    checkString(vision.meta, 'updatedAt', 'meta', errors);
    if (vision.meta.version !== CURRENT_VERSION) {
      errors.push(`meta.version is "${vision.meta.version}" — expected "${CURRENT_VERSION}". Run with --migrate to update.`);
    }
    if (!vision.meta.plaidVersion) {
      warnings.push('meta.plaidVersion is missing');
    }
  }

  // creator validation
  if (vision.creator) {
    checkString(vision.creator, 'name', 'creator', errors);
    checkString(vision.creator, 'expertise', 'creator', errors);
    checkString(vision.creator, 'background', 'creator', errors);
  }

  // purpose validation
  if (vision.purpose) {
    checkString(vision.purpose, 'whoYouHelp', 'purpose', errors);
    checkString(vision.purpose, 'problemYouSolve', 'purpose', errors);
    checkString(vision.purpose, 'desiredTransformation', 'purpose', errors);
    checkString(vision.purpose, 'whyYou', 'purpose', errors);
  }

  // product validation
  if (vision.product) {
    checkString(vision.product, 'name', 'product', errors);
    checkString(vision.product, 'oneLiner', 'product', errors);
    checkString(vision.product, 'howItWorks', 'product', errors);
    checkString(vision.product, 'magicMoment', 'product', errors);
    checkString(vision.product, 'marketDifferentiation', 'product', errors);

    const validPlatforms = ['web', 'mobile', 'desktop', 'cross-platform'];
    if (!validPlatforms.includes(vision.product.platform)) {
      errors.push(`product.platform must be one of: ${validPlatforms.join(', ')}. Got: "${vision.product.platform}"`);
    }

    if (!Array.isArray(vision.product.keyCapabilities)) {
      errors.push('product.keyCapabilities must be an array');
    } else if (vision.product.keyCapabilities.length === 0) {
      errors.push('product.keyCapabilities must have at least 1 item');
    } else {
      vision.product.keyCapabilities.forEach((cap, i) => {
        if (typeof cap !== 'string' || cap.trim() === '') {
          errors.push(`product.keyCapabilities[${i}] must be a non-empty string`);
        }
      });
    }
  }

  // audience validation
  if (vision.audience) {
    checkString(vision.audience, 'primaryUser', 'audience', errors);
    checkString(vision.audience, 'currentAlternatives', 'audience', errors);
    checkString(vision.audience, 'frustrations', 'audience', errors);

    if (!Array.isArray(vision.audience.secondaryUsers)) {
      errors.push('audience.secondaryUsers must be an array');
    } else if (vision.audience.secondaryUsers.length === 0) {
      warnings.push('audience.secondaryUsers is empty — consider adding at least one secondary user');
    }
  }

  // business validation
  if (vision.business) {
    const validModels = ['subscription', 'freemium', 'one-time', 'marketplace', 'ad-supported', 'free'];
    if (!validModels.includes(vision.business.revenueModel)) {
      errors.push(`business.revenueModel must be one of: ${validModels.join(', ')}. Got: "${vision.business.revenueModel}"`);
    }

    checkString(vision.business, 'initialGoal', 'business', errors);
    checkString(vision.business, 'sixMonthVision', 'business', errors);
    checkString(vision.business, 'constraints', 'business', errors);
    checkString(vision.business, 'goToMarket', 'business', errors);
  }

  // feeling validation
  if (vision.feeling) {
    checkString(vision.feeling, 'brandPersonality', 'feeling', errors);
    checkString(vision.feeling, 'visualMood', 'feeling', errors);
    checkString(vision.feeling, 'toneOfVoice', 'feeling', errors);
    checkString(vision.feeling, 'antiPatterns', 'feeling', errors);
  }

  // techStack validation
  if (vision.techStack) {
    const validAppTypes = ['web', 'mobile', 'desktop', 'cross-platform'];
    if (!validAppTypes.includes(vision.techStack.appType)) {
      errors.push(`techStack.appType must be one of: ${validAppTypes.join(', ')}. Got: "${vision.techStack.appType}"`);
    }

    const stackLayers = ['frontend', 'backend', 'database', 'auth', 'payments'];
    for (const layer of stackLayers) {
      if (!vision.techStack[layer]) {
        // payments can be empty if revenue model is free
        if (layer === 'payments' && vision.business?.revenueModel === 'free') {
          continue;
        }
        errors.push(`techStack.${layer} is missing`);
      } else {
        if (typeof vision.techStack[layer] !== 'object') {
          errors.push(`techStack.${layer} must be an object with "choice" and "rationale"`);
        } else {
          // payments can have empty choice if free
          if (layer === 'payments' && vision.business?.revenueModel === 'free') {
            // Allow empty
          } else {
            checkString(vision.techStack[layer], 'choice', `techStack.${layer}`, errors);
          }
          if (!vision.techStack[layer].rationale || vision.techStack[layer].rationale.trim() === '') {
            warnings.push(`techStack.${layer}.rationale is empty — consider adding reasoning`);
          }
        }
      }
    }
  }

  // tooling validation
  if (vision.tooling) {
    const validAgents = ['claude-code', 'cursor', 'windsurf', 'copilot', 'other'];
    if (!validAgents.includes(vision.tooling.codingAgent)) {
      errors.push(`tooling.codingAgent must be one of: ${validAgents.join(', ')}. Got: "${vision.tooling.codingAgent}"`);
    }
    if (vision.tooling.codingAgent === 'other' && !vision.tooling.codingAgentName) {
      errors.push('tooling.codingAgentName is required when codingAgent is "other"');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function checkString(obj, field, section, errors) {
  if (obj[field] === undefined || obj[field] === null) {
    errors.push(`${section}.${field} is missing`);
  } else if (typeof obj[field] !== 'string') {
    errors.push(`${section}.${field} must be a string`);
  } else if (obj[field].trim() === '') {
    errors.push(`${section}.${field} is empty`);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const doMigrate = args.includes('--migrate');
const visionPath = args.find(a => a !== '--migrate') || path.join(process.cwd(), 'vision.json');

// Check file exists
if (!fs.existsSync(visionPath)) {
  console.log(JSON.stringify({
    valid: false,
    errors: [`vision.json not found at ${visionPath}`],
    warnings: []
  }, null, 2));
  process.exit(1);
}

// Parse JSON
let vision;
try {
  const raw = fs.readFileSync(visionPath, 'utf-8');
  vision = JSON.parse(raw);
} catch (e) {
  console.log(JSON.stringify({
    valid: false,
    errors: [`Failed to parse vision.json: ${e.message}`],
    warnings: []
  }, null, 2));
  process.exit(1);
}

// Check if migration is needed
const fileVersion = vision.meta?.version;
const needsMigration = fileVersion && fileVersion !== CURRENT_VERSION;

if (needsMigration) {
  const migrationResult = migrate(vision);

  if (!migrationResult.success) {
    console.log(JSON.stringify({
      valid: false,
      errors: [migrationResult.error],
      warnings: [],
      migrated: false,
      migrationsApplied: []
    }, null, 2));
    process.exit(1);
  }

  if (doMigrate) {
    // Write migrated file and validate the result
    vision = migrationResult.vision;
    fs.writeFileSync(visionPath, JSON.stringify(vision, null, 2) + '\n', 'utf-8');
    const result = validate(vision);
    console.log(JSON.stringify({
      ...result,
      migrated: true,
      migrationsApplied: migrationResult.applied
    }, null, 2));
    process.exit(result.valid ? 0 : 1);
  } else {
    // Dry-run: report what would happen
    console.log(JSON.stringify({
      valid: false,
      errors: [`vision.json is at schema version ${fileVersion}. Current is ${CURRENT_VERSION}. Run with --migrate to update.`],
      warnings: [],
      migrated: false,
      migrationsApplied: [],
      pendingMigrations: migrationResult.applied
    }, null, 2));
    process.exit(1);
  }
}

// No migration needed — validate directly
const result = validate(vision);
console.log(JSON.stringify({
  ...result,
  migrated: false,
  migrationsApplied: []
}, null, 2));
process.exit(result.valid ? 0 : 1);
