export const transactionItemStyles = {
  container: "flex items-center gap-4 py-4 px-0 hover:bg-onsurface-900 transition-all duration-200 rounded cursor-pointer",
  imageContainer: "flex-shrink-0",
  image: "w-8 h-8 object-cover",
  descriptionContainer: "flex-1",
  title: "text-subheading2 text-white-900 mb-2",
  date: "text-caption text-white-700",
  amountContainer: "text-right flex-shrink-0",
  amount: {
    investment: "text-callout text-green-400 mb-2",
    return: "text-subheading2 text-white-900 mb-2",
    dividends: "text-subheading2 text-white-900 mb-2"
  },
  status: "text-caption text-white-700"
};
