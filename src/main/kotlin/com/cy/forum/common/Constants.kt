
class Constants {
    enum class ExceptionType(val exceptionType: String) {
        AUTHENTICATION("Authentication"),
        NOPERMISSION("No Permission");

        override fun toString(): String {
            return exceptionType + "Exception. "
        }
    }
}