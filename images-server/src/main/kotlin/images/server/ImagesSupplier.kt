package images.server

import java.io.File
import java.lang.Exception
import java.nio.file.Files
import java.util.*
import kotlin.time.Duration.Companion.seconds


class ImagesSupplier(val rootFolder: File, val deletedPhotosFolder: File):Runnable {



    var _listOfImages:MutableList<ImageInfo> = mutableListOf()
    val listOfImagesLock = "listOfImagesLock"
    val rnd = Random()

    val imagesRefresherThread = Thread( this,"Images list refresher")


    init {
        if( !deletedPhotosFolder.exists()){
            println("Creating folder for deleted images: ${deletedPhotosFolder.absolutePath}")
            deletedPhotosFolder.mkdirs()
        }
        if( ! rootFolder.exists() ){
            println("Creating folder for images ${rootFolder.absolutePath}")
        }
        collectAllFiles()
        imagesRefresherThread.start()
    }

    fun rootDirForKtor():File {
        return rootFolder.parentFile
    }

    fun filesForKtor():String { return rootFolder.name }



    fun  getRandomImage():ImageInfo{
        val listOfImages = getListOfImages()
        return listOfImages[rnd.nextInt( listOfImages.size )]
    }

    var lastImageUpdate:Long = 0L
    fun hasImageUpdates():Boolean {
        var lastModified = 0L
        rootFolder.walkTopDown().forEach { file ->
            if( isImageFile(file) ) {
                val updateTime = file.lastModified()
                if( lastModified < updateTime ){
                    lastModified = updateTime
                }
            }
        }
        return lastImageUpdate != lastModified
    }
    fun collectAllFiles() {
        val rootFolderName = rootFolder.absolutePath
        println("Collecting images in folder $rootFolderName")
        val bufferForImages:MutableList<ImageInfo> = mutableListOf()
        var counter = 0
        var lastModified = 0L
        rootFolder.walkTopDown().forEach { file ->
             if( isImageFile(file) ) {
                 val updateTime = file.lastModified()
                 if( lastModified < updateTime ){
                      lastModified = updateTime
                 }
                 val uri = file.absolutePath.substring(rootFolderName.length + 1)
                 bufferForImages.add(ImageInfo(uri))
//                 println(" $uri")
                 counter ++
             }

         }
        setlistOfImages( bufferForImages )
        lastImageUpdate = lastModified
        println("Collected $counter images")
    }

    private fun setlistOfImages(images: MutableList<ImageInfo>) {
        synchronized( listOfImagesLock) {
            _listOfImages = images
        }
    }
    private fun getListOfImages(): MutableList<ImageInfo> {
        synchronized(listOfImagesLock){
            return _listOfImages
        }
    }

    private fun isImageFile(file: File): Boolean {
       val fileName = file.name.toUpperCase()
        return fileName.endsWith("JPG")||fileName.endsWith("PNG")||fileName.endsWith("JPEG")
    }

    fun deleteImage(imgPath: String): Boolean {
       try {
           println("to be deleted: $imgPath")
           val originalFile = File(rootFolder, imgPath)
           val newFileLocation = File(deletedPhotosFolder, imgPath)
           val newFileFolder = newFileLocation.parentFile
           if (!newFileFolder.exists()) {
               newFileFolder.mkdirs()
           }
           Files.move(originalFile.toPath(), newFileLocation.toPath())
           val deleted = getListOfImages().removeIf { ii -> ii.uri == imgPath }
           if (deleted) {
               println("Image was deleted:$imgPath")
           }
           return true;
       }catch (ex:Exception){
           ex.printStackTrace()
           throw ex
       }
    }

    override fun run() {
        while( true ) {
//            println("Checking for updates")
            try {
                if (hasImageUpdates()) {
                    collectAllFiles()
                }
            } catch (e: Throwable) {
                println("Got error: $e")
                e.printStackTrace()
            }
            Thread.sleep( 30000 )
        }
    }
}


data class ImageInfo( val uri:String)
