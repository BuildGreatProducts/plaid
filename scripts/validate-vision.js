#!/usr/bin/env node

/**
 * PLAID Vision Validator
 * Validates that vision.json conforms to the expected schema.
 *
 * Usage: node scripts/validate-vision.js [path-to-vision.json]
 * Default path: ./vision.json
 *
 * Returns JSON: { valid: boolean, errors: string[], warnings: string[] }
 */

const fs = require('fs');
const path = require('path');

const visionPath = process.argv[2] || path.join(process.cwd(), 'vision.json');

function validate(filePath) {
  const errors = [];
  const warnings = [];

  // Check file exists
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      errors: [`vision.json not found at ${filePath}`],
      warnings: []
    };
  }

  // Parse JSON
  let vision;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    vision = JSON.parse(raw);
  } catch (e) {
    return {
      valid: false,
      errors: [`Failed to parse vision.json: ${e.message}`],
      warnings: []
    };
  }

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
    if (vision.meta.version !== '1.0') {
      warnings.push(`meta.version is "${vision.meta.version}" — expected "1.0"`);
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

// Run validation
const result = validate(visionPath);

// Output result
console.log(JSON.stringify(result, null, 2));

// Exit with appropriate code
process.exit(result.valid ? 0 : 1);
