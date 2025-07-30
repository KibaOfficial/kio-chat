// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "../ui/button";

function UploadButtonTestCard() {
  const [url, setUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">UploadButton Test (Simple)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <UploadButton
          endpoint="profileImage"
          onUploadBegin={() => {
            console.log("🚀 Simple upload started");
            setLoading(true);
            setUrl("");
            setFileName("");
          }}
          onClientUploadComplete={(res) => {
            console.log("✅ Simple upload complete:", res);
            
            if (res && res.length > 0) {
              const file = res[0];
              setUrl(file.url);
              setFileName(file.name);
              console.log("🔗 File URL:", file.url);
            }
            setLoading(false);
          }}
          onUploadError={(error) => {
            console.error("❌ Simple upload error:", error);
            setLoading(false);
          }}
        />
        {loading && (
          <div className="text-blue-600 text-sm">Upload läuft...</div>
        )}
        {url && !loading && (
          <div className="space-y-2">
            <div className="text-green-600 text-sm">
              Upload erfolgreich! Datei: {fileName}
            </div>
            <div className="text-xs text-muted-foreground break-all">
              URL: <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
            </div>
            <img src={url} alt="Uploaded" className="max-w-32 max-h-32 object-contain border rounded" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TimeoutFixComponent() {
  const [url, setUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadStartTime, setUploadStartTime] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const resetState = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setUrl("");
    setFileName("");
    setError("");
    setLoading(false);
    setUploadStartTime(0);
  };

  const handleUploadBegin = () => {
    console.log("🚀 Upload started");
    const startTime = Date.now();
    setUploadStartTime(startTime);
    setLoading(true);
    setUrl("");
    setFileName("");
    setError("");

    // Set a timeout - if upload doesn't complete in 30 seconds, show error
    const timeout = setTimeout(() => {
      console.log("⏰ Upload timeout reached - checking if file was actually uploaded");
      setError("Upload timeout - aber möglicherweise trotzdem erfolgreich. Check die Network-Tabs!");
      setLoading(false);
    }, 30000);
    
    setTimeoutId(timeout);
  };

  const handleUploadComplete = (res: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    const elapsed = Date.now() - uploadStartTime;
    console.log("✅ Upload complete in", elapsed + "ms", res);

    const fileData = Array.isArray(res) ? res[0] : res;

    const fileUrl = fileData?.url || fileData?.ufsUrl || fileData?.fileUrl || fileData?.key;
    const name = fileData?.name || fileData?.fileName || "";
    
    console.log("🔗 Extracted URL:", fileUrl);
    console.log("📄 Extracted name:", name);
    console.log("📋 Full response:", JSON.stringify(res, null, 2));
    
    if (fileUrl) {
      let finalUrl = fileUrl;
      if (!fileUrl.startsWith('http')) {
        finalUrl = `https://utfs.io/f/${fileUrl}`;
        console.log("🔧 Constructed URL:", finalUrl);
      }
      
      setUrl(finalUrl);
      setFileName(name);
      setError("");
    } else {
      setError("No URL found in response");
      console.error("❌ No URL found:", res);
    }
    setLoading(false);
  };

  const handleUploadError = (error: Error) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    const elapsed = Date.now() - uploadStartTime;
    console.error("❌ Upload error after", elapsed + "ms:", error);
    setError(error.message || "Upload failed");
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upload mit Timeout Fix</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button onClick={resetState} variant="outline" size="sm">
            Reset
          </Button>
        </div>
        
        <UploadButton
          endpoint="profileImage"
          onUploadBegin={handleUploadBegin}
          onUploadProgress={(progress) => {
            const elapsed = Date.now() - uploadStartTime;
            console.log(`📊 Progress: ${progress}% (${elapsed}ms)`);
            
            // If progress reaches 100%, set a fallback timer
            if (progress === 100) {
              console.log("🎯 Progress reached 100%! Setting fallback timer...");
              setTimeout(() => {
                if (loading) {
                  console.log("🔍 3 seconds after 100% - no completion callback received");
                  console.log("🔍 This suggests the upload to UploadThing servers failed");
                  setError("Upload reached 100% but never completed. Check network tab for errors.");
                  setLoading(false);
                }
              }, 3000);
            }
          }}
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          appearance={{
            button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded",
            allowedContent: "text-sm text-gray-600",
          }}
        />
        
        {loading && (
          <div className="space-y-2">
            <div className="text-blue-600 text-sm">
              Upload läuft... {uploadStartTime ? `(${Math.round((Date.now() - uploadStartTime) / 1000)}s)` : ""}
            </div>
            <div className="text-xs text-muted-foreground">
              Falls es länger als 30s dauert, check die Network-Tabs im Browser!
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: "50%"}}></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-sm p-3 border border-red-200 rounded bg-red-50">
            <div className="font-medium">❌ Error: {error}</div>
            <div className="text-xs mt-1">
              Tipp: Schau in die Network-Tabs ob der Upload trotzdem erfolgreich war!
            </div>
          </div>
        )}
        
        {url && !loading && (
          <div className="space-y-3 p-3 border border-green-200 rounded bg-green-50">
            <div className="text-green-600 font-medium">
              ✅ Upload erfolgreich!
            </div>
            <div className="text-sm">
              <strong>Datei:</strong> {fileName || "Unbekannt"}
            </div>
            <div className="text-xs break-all">
              <strong>URL:</strong> 
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                {url}
              </a>
            </div>
            <div>
              <img src={url} alt="Uploaded" className="max-w-32 max-h-32 object-contain border rounded" />
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-3">
          <div className="font-medium mb-2">Debug Info:</div>
          <div className="space-y-1 font-mono text-xs">
            <div>Loading: {loading.toString()}</div>
            <div>URL: {url || "none"}</div>
            <div>FileName: {fileName || "none"}</div>
            <div>Error: {error || "none"}</div>
            <div>Timeout Active: {timeoutId ? "yes" : "no"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default UploadButtonTestCard;
export { TimeoutFixComponent as UploadButtonTestCardWithTimeout };