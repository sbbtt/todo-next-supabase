
const page = () => {
  const now = new Date().toString()
  return (
    <div>
      <div>page</div>
      <div>{now}</div>

    </div>
  )
}
export default page

export const revalidate = 10;