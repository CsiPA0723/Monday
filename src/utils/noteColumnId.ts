import formatDate from "./formatDate";

function make(title: string, date: string|number|Date, userId: string) {
  if(!title) throw new Error("Title is eather null or undefined!");
  if(date === undefined) throw new Error("Date is undefined!");
  if(!userId) throw new Error("User id is eather null or undefined!");
  return `${title}_${formatDate(date)}_${userId}`;
}

function split(noteColumnId: string) {
  if(!noteColumnId) throw new Error("Note Column Id is eather null or undefined!");
  const temp = noteColumnId.split("_");
  const title = temp.splice(0, 1)[0];
  const date = temp.splice(0, 1)[0];
  const userId = temp.join("_");
  return { title, date, userId };
}

export default {
  make,
  split
};