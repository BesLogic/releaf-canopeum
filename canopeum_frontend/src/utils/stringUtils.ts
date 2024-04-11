export const numberOfWordsInText = (text: string) => {
  const wordsArray = text.match(/\S+/gu)

  if (!wordsArray) return 0

  return wordsArray.length
}
