"use client"

/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react"
import { getScrapeLog } from "@/api/apiScrapeLog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScrapeLogsModal({ open, onOpenChange }) {
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreLogs, setHasMoreLogs] = useState(true)
  const pageSize = 15 // Number of logs per page

  const fetchScrapeLog = useCallback(
    async (page = currentPage) => {
      setLogsLoading(true)
      try {
        const logData = await getScrapeLog({
          page,
          limit: pageSize,
        })

        const fetchedLogs = logData?.data || []
        setLogs(fetchedLogs)

        // Check if we have more logs to load
        setHasMoreLogs(fetchedLogs.length === pageSize)
      } catch (error) {
        console.error("Failed to fetch scrape logs:", error)
      } finally {
        setLogsLoading(false)
      }
    },
    [currentPage, pageSize],
  )

  useEffect(() => {
    if (open) {
      fetchScrapeLog()
    }
  }, [open, fetchScrapeLog])

  // When page changes, fetch new logs
  useEffect(() => {
    if (open) {
      fetchScrapeLog(currentPage)
    }
  }, [currentPage, open, fetchScrapeLog])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between mt-4">
          <DialogTitle>Scrape Logs</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage(1)
              fetchScrapeLog(1)
            }}
            disabled={logsLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${logsLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </DialogHeader>
        <div className="py-4">
          {logsLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : logs.length > 0 ? (
            <>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log._id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{log.ota || "Unknown Source"}</span>
                        <span className="text-sm text-gray-500">
                          {log.timestamp?.$date ? new Date(log.timestamp.$date).toLocaleString() : "Unknown Time"}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                          {log.note || "No additional information"}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-center mt-8 gap-4">
                <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1 || logsLoading}>
                  Previous
                </Button>
                <span className="self-center font-medium">Page {currentPage}</span>
                <Button variant="outline" onClick={handleNextPage} disabled={!hasMoreLogs || logsLoading}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500">No logs found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
