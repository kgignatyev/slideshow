package images.server

import java.io.File
import java.lang.Exception
import java.nio.file.Files
import java.util.*


class ImagesSupplier(val rootFolder: File, val deletedPhotosFolder: File) {



    var listOfImages:MutableList<ImageInfo> = mutableListOf()
    val rnd = Random()

    init {
        if( !deletedPhotosFolder.exists()){
            println("Creating folder for deleted images:" + deletedPhotosFolder.absolutePath)
            deletedPhotosFolder.mkdirs()
        }
    }

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

    fun deleteImage(imgPath: String): Boolean {
       try {
           println("to be deleted: " + imgPath)
           val originalFile = File(rootFolder, imgPath)
           val newFileLocation = File(deletedPhotosFolder, imgPath)
           val newFileFolder = newFileLocation.parentFile
           if (!newFileFolder.exists()) {
               newFileFolder.mkdirs()
           }
           Files.move(originalFile.toPath(), newFileLocation.toPath())
           val deleted = listOfImages.removeIf { ii -> ii.uri == imgPath }
           if (deleted) {
               println("Image was deleted:" + imgPath)
           }
           return true;
       }catch (ex:Exception){
           ex.printStackTrace()
           throw ex
       }
    }
}


data class ImageInfo( val uri:String)
