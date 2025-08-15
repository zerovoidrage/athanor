export const transactionItemStyles = {
  container: "flex items-center gap-4 py-5 px-4 hover:bg-onsurface-900 transition-all duration-200 rounded cursor-pointer",
  imageContainer: "flex-shrink-0",
  image: "w-6 h-6 object-cover",
  descriptionContainer: "flex-1",
  title: "text-callout text-white-900 mb-1",
  date: "text-caption text-white-700",
  amountContainer: "text-right flex-shrink-0",
  amount: {
    investment: "text-callout text-green-400 mb-1",
    return: "text-callout text-white-900 mb-1",
    dividends: "text-callout text-white-900 mb-1"
  },
  status: "text-caption text-white-700"
};
