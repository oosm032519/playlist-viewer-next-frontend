// app/types/album.ts
import {ExternalUrls} from '@/app/types/externalUrls'
import {Image} from '@/app/types/image'

export interface Album {
    name: string;
    images: Image[];
    externalUrls: ExternalUrls;
}
