import { getDataSource } from "../../db";
import { ShowEntity } from "../entities/show.entity";

export async function getShowRepository() {
  const ds = await getDataSource();
  return ds.getRepository(ShowEntity);
}
