# TODO

## Next Steps

### 1. Build Flow (Highest Priority)

- [ ] Create UI to show available buildings to construct
- [ ] Add "build" form action (similar to upgrade action pattern)
- [ ] Update UI to show available building slots vs. used slots
- [ ] Handle building construction API call (`/api/game/buildings/build` or
      similar)
- [ ] Display build requirements and validation (resources, max_count limits)

**Why**: This completes the core building lifecycle (build → upgrade → confirm).
Players currently can only upgrade existing buildings, not construct new ones.

### 2. Building Flow Improvements

- [ ] Add timer display showing when upgrades will finish
- [ ] Implement auto-refresh or polling to update building states
- [ ] Add better visual feedback for in-progress upgrades (progress bars,
      countdown timers)
- [ ] Show upgrade completion notifications

**Why**: Improves user experience and makes the game feel more dynamic.

### 3. Resource Flow Polish

- [ ] Add auto-collect or timer showing when to collect resources
- [ ] Visual indication when resources are capped
- [ ] Show production rate calculations more clearly
- [ ] Add resource overflow warnings

**Why**: Makes resource management clearer and prevents players from missing
collections.

---

## Notes

- Current working features: resource display, collect action, upgrade flow,
  confirm upgrade flow
- Missing: ability to build new buildings from scratch
- API endpoints already exist for most operations
- Form action pattern is established and working well
