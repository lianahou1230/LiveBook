import { getDataSource } from "../../db";
import { PhotoEntity } from "../entities/photo.entity";

export async function getPhotoRepository() {
  const ds = await getDataSource();
  return ds.getRepository(PhotoEntity);
}
