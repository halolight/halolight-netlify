# Security Policy

## Known Vulnerabilities

### mockjs Prototype Pollution (High Severity)

**Status**: Known Issue - No Fix Available

**Details**:
- **Package**: mockjs
- **Vulnerable Version**: <=1.1.0 (currently using 1.1.0)
- **Issue**: Prototype Pollution via the Util.extend function
- **Advisory**: [GHSA-mh8j-9jvh-gjf6](https://github.com/advisories/GHSA-mh8j-9jvh-gjf6)
- **Patched Version**: No patch available (indicated as `<0.0.0`)

**Mitigation**:
- mockjs is **only used in development/demo mode** for mocking API responses
- The package is **not used in production builds** when `NEXT_PUBLIC_MOCK=false`
- The vulnerability has **limited impact** as it only affects development environments
- Risk is further reduced as mockjs runs client-side in a sandboxed browser environment

**Recommendation**:
- Keep `NEXT_PUBLIC_MOCK=false` in production environments
- Consider replacing mockjs with a maintained alternative (e.g., MSW) in future updates
- Monitor for updates to mockjs or security patches

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it to:

- Email: h7ml@qq.com
- GitHub Security Advisory: Use the "Security" tab to report privately

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fixes (if any)

We will respond within 48 hours and work with you to address the issue promptly.

## Security Update Process

1. All security updates are applied with high priority
2. Dependencies are regularly audited using `pnpm audit`
3. CI/CD pipeline includes automated security checks
4. Known issues are documented in this file
