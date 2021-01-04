package images.server

import java.io.File
import java.util.*


class ImagesSupplier( val rootFolder: File) {

    var listOfImages:List<ImageInfo> = mutableListOf()
    val rnd = Random()

    fun rootDirForKtor():File {
        return rootFolder.parentFile
    }

    fun filesForKtor():String { return rootFolder.name }

    init {
        collectAllFiles()
    }

    fun  getRandomImage():ImageInfo{
        return listOfImages.get( rnd.nextInt( listOfImages.size ) )
    }

    fun collectAllFiles() {
        val rootFolderName = rootFolder.absolutePath
        var listOfImages:MutableList<ImageInfo> = mutableListOf()
        var counter = 0;
        rootFolder.walkTopDown().forEach { file ->
             if( isImageFile(file) ) {

                 val uri = file.absolutePath.substring(rootFolderName.length + 1)
                 listOfImages.add(ImageInfo(uri))
//                 println(" $uri")
                 counter ++
             }

         }
        this.listOfImages = listOfImages
        println("Collected $counter images")
    }

    private fun isImageFile(file: File): Boolean {
       val fileName = file.name.toUpperCase()
        return fileName.endsWith("JPG")||fileName.endsWith("PNG")||fileName.endsWith("JPEG")
    }
}


data class ImageInfo( val uri:String)
