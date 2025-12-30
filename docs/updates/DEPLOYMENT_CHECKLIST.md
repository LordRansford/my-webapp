# Deployment Checklist

## Pre-Deployment

- [x] All TypeScript types defined
- [x] Zod schemas created and validated
- [x] Source registry configured with 5 initial sources
- [x] Security utilities implemented (SSRF, sanitization)
- [x] Ingestion scripts created with adapters
- [x] GitHub Actions workflow configured
- [x] Frontend components built and tested
- [x] Navigation link added
- [x] Failover logic implemented
- [x] Initial data files created
- [x] Documentation written

## Post-Deployment

- [ ] Verify GitHub Actions workflow runs successfully
- [ ] Check that `data/news/latest.json` is populated after first run
- [ ] Test `/updates` page loads correctly
- [ ] Verify failover works (temporarily corrupt `latest.json` to test)
- [ ] Check that all 5 sources are fetching data
- [ ] Verify status badges show correct state
- [ ] Test filtering and search functionality
- [ ] Verify audience mode switching works
- [ ] Check mobile responsiveness
- [ ] Test keyboard navigation and accessibility

## Monitoring

- [ ] Set up alerts for failed GitHub Actions runs
- [ ] Monitor `data/news/report.json` for errors
- [ ] Check ingestion frequency (should run every 6 hours)
- [ ] Verify archive cleanup (60-day retention)
- [ ] Monitor repository size (snapshots should be reasonable)

## Known Limitations

1. **TypeScript in Scripts**: Adapters are TypeScript but main.mjs is JavaScript. May need `tsx` or compilation step.
2. **NVD Rate Limits**: Limited to 5 requests/minute - may need batching for large fetches
3. **Initial Empty State**: First run will have empty snapshots until sources are fetched
4. **Archive Size**: 60 days of daily snapshots - monitor repo size

## Future Enhancements

1. Add sector lens mapping for better technology tagging
2. Implement verified source badge tiering
3. Add offline support via Service Worker
4. Create weekly digest page
5. Add ingestion rules changelog
