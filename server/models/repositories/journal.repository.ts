import { getDataSource } from "../../db";
import { JournalEntity } from "../entities/journal.entity";

export async function getJournalRepository() {
  const ds = await getDataSource();
  return ds.getRepository(JournalEntity);
}
