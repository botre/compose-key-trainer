# Design rules

The app is one screen styled by `src/index.css`. These are the rules new UI
work keeps, mostly for phones and touch screens.

## Base styles

- Every element uses `box-sizing: border-box`, set once at the top of
  `src/index.css`. A box at `width: 100%` stays inside its parent. Set a fixed
  width as the outer size, padding included.
- The answer field is styled by the base `input` rule. Its text is 1.6rem, well
  above the 16px under which iOS Safari zooms into a focused field. A new field
  keeps at least 16px.
- The answer field turns off `autoCapitalize`, `autoCorrect` and `spellCheck`,
  since a keyboard that changes the typed character marks a right answer
  wrong. A new text field that takes exact characters does the same.

## Touch targets

- On a coarse pointer every `button` and `label` is at least 44px tall, from
  one rule at the end of `src/index.css`. A new control is a `button`, or a
  `label` around its input, so it gets the size without a rule of its own.
- The desktop layout stays compact: the rule only applies under
  `pointer: coarse`.
- No control works only on hover. The key caps lift on hover, which is
  decoration.

## Small screens

- Nothing scrolls sideways at 320px.
- Below 640px the cards stack and the trainer comes first, so a phone opens on
  the character to type, not on the deck list.
- A key sequence wraps between groups, never between a `+` and its key: each
  pair sits in a `.key-group` that does not wrap.
- A list of options, such as the decks, stacks in one column on a phone.

## Loading

- The first render already shows a character: the symbols are shuffled in the
  state initialiser, not in an effect. A first frame that is empty and then
  fills in shifts the layout on a slow connection.
- The empty state ("Select at least one deck") shows only when no deck is on,
  never while data is still being prepared.
- The page renders only once the script bundle has run, so keep the bundle
  small. A slow connection shows a blank page until then.
